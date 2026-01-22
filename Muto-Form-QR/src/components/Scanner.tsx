
import { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

const PIN_CODE = '1234'; // Simple protection

const Scanner = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [scanResult, setScanResult] = useState<any>(null);
    const [ticketStatus, setTicketStatus] = useState<'idle' | 'valid' | 'used' | 'invalid' | 'loading'>('idle');
    const [ticketData, setTicketData] = useState<any>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [urlTicketId, setUrlTicketId] = useState<string | null>(null);

    useEffect(() => {
        // Check if opened via URL (e.g. /scan?id=UUID)
        const params = new URLSearchParams(window.location.search);
        const idFromUrl = params.get('id');
        if (idFromUrl) {
            setUrlTicketId(idFromUrl);
        }
    }, []);

    // Trigger verification if authenticated and we have a URL ID pending
    useEffect(() => {
        if (isAuthenticated && urlTicketId && ticketStatus === 'idle') {
            verifyTicket(urlTicketId);
        }
    }, [isAuthenticated, urlTicketId, ticketStatus]);

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === PIN_CODE) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect PIN');
        }
    };

    const verifyTicket = async (ticketId: string) => {
        if (!ticketId) return;

        setScanResult(ticketId);
        setTicketStatus('loading');

        try {
            // Fetch ticket
            const { data: ticket, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('id', ticketId)
                .single();

            if (error || !ticket) {
                setTicketStatus('invalid');
                return;
            }

            setTicketData(ticket);

            if (ticket.status === 'used') {
                setTicketStatus('used');
            } else {
                setTicketStatus('valid');
            }

        } catch (err) {
            console.error(err);
            setTicketStatus('invalid');
        }
    };

    const handleScan = (data: any) => {
        if (data && ticketStatus !== 'loading' && ticketStatus !== 'valid' && ticketStatus !== 'used') {
            let ticketId = data.text; // react-qr-scanner returns { text: string }
            if (!ticketId) return;

            // Handle URL in QR code (e.g. https://site.com/scan?id=UUID)
            try {
                const url = new URL(ticketId);
                const idParam = url.searchParams.get('id');
                if (idParam) {
                    ticketId = idParam;
                }
            } catch (e) {
                // Not a valid URL, assume it's just the ID
            }

            verifyTicket(ticketId);
        }
    };

    const handleError = (err: any) => {
        console.error(err);
        setCameraError("Error accessing camera.");
    };

    const handleCheckIn = async () => {
        if (!ticketData) return;

        try {
            const { error } = await supabase
                .from('tickets')
                .update({ status: 'used' })
                .eq('id', ticketData.id);

            if (error) throw error;

            setTicketStatus('used');
            alert('Check-in successful!');
        } catch (err) {
            console.error(err);
            alert('Error updating ticket.');
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setTicketStatus('idle');
        setTicketData(null);

        // If we were in URL mode, clear it so we can scan others manually if needed
        if (urlTicketId) {
            setUrlTicketId(null);
            // Optionally clear URL params without reload
            window.history.replaceState({}, '', window.location.pathname);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gold p-4">
                <h1 className="text-3xl font-orbitron mb-8 text-yellow-500">Staff Access</h1>
                <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter PIN"
                        className="bg-gray-900 border border-yellow-500 text-white p-3 rounded text-center text-xl"
                    />
                    <button type="submit" className="bg-yellow-500 text-black font-bold py-3 px-6 rounded hover:bg-yellow-400 transition">
                        Enter
                    </button>
                    {urlTicketId && <p className="text-gray-400 text-sm text-center">Validating ticket...</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-full max-w-md flex justify-between items-center mb-6">
                <h1 className="text-2xl font-orbitron text-yellow-500">Muto Scanner</h1>
                <button onClick={() => setIsAuthenticated(false)} className="text-gray-400 text-sm">Logout</button>
            </div>

            {ticketStatus === 'idle' && (
                <div className="relative w-full max-w-md aspect-square bg-gray-900 overflow-hidden rounded-lg border-2 border-yellow-500/50">
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%', height: '100%' }}
                    />
                    {cameraError && <div className="absolute inset-0 flex items-center justify-center text-red-500">{cameraError}</div>}
                    <div className="absolute inset-0 border-2 border-yellow-500 opacity-50 pointer-events-none"></div>
                    <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-300 bg-black/50 py-1">Scanning...</p>
                </div>
            )}

            {ticketStatus === 'loading' && (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            )}

            {ticketStatus === 'valid' && ticketData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-green-500 p-6 rounded-lg w-full max-w-md text-center">
                    <h2 className="text-3xl font-bold text-green-500 mb-2">ACCESS GRANTED</h2>
                    <p className="text-xl text-white mb-1">{ticketData.full_name}</p>
                    <p className="text-gray-400 mb-4">{ticketData.dni}</p>
                    <button onClick={handleCheckIn} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-green-500 transition">
                        CHECK IN
                    </button>
                    <button onClick={resetScanner} className="mt-4 text-gray-400 underline">Cancel</button>
                </motion.div>
            )}

            {ticketStatus === 'used' && ticketData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-yellow-500 p-6 rounded-lg w-full max-w-md text-center">
                    <h2 className="text-3xl font-bold text-yellow-500 mb-2">ALREADY USED</h2>
                    <p className="text-xl text-white mb-1">{ticketData.full_name}</p>
                    <p className="text-gray-400 mb-4">Checked in previously</p>
                    <button onClick={resetScanner} className="w-full bg-gray-700 text-white font-bold py-4 rounded-lg text-xl hover:bg-gray-600 transition">
                        Scan Next
                    </button>
                </motion.div>
            )}

            {ticketStatus === 'invalid' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-red-500 p-6 rounded-lg w-full max-w-md text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-2">INVALID TICKET</h2>
                    <p className="text-gray-400 mb-4">ID: {scanResult}</p>
                    <button onClick={resetScanner} className="w-full bg-red-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-red-500 transition">
                        Scan Next
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Scanner;
