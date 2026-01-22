declare module 'react-qr-scanner' {
    import * as React from 'react';

    export interface QrScannerProps {
        delay?: number | false;
        onError?: (error: any) => void;
        onScan?: (data: any) => void;
        style?: React.CSSProperties;
        className?: string;
        constraints?: MediaStreamConstraints;
    }

    export default class QrScanner extends React.Component<QrScannerProps> { }
}
