
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useData } from '../../context/DataContext';
import { Bin } from '../../types';
import BinScanModal from '../shared/BinScanModal';

const SCANNER_ID = 'qr-reader';

const ScanBinView = () => {
    const { state } = useData();
    const { bins } = state;
    const [scannedBin, setScannedBin] = useState<Bin | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [isScannerActive, setIsScannerActive] = useState(false);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode(SCANNER_ID, {
                verbose: false,
            });
        }
        const qrCode = html5QrCodeRef.current;

        const startScanner = async () => {
            try {
                await qrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        handleScanSuccess(decodedText);
                    },
                    () => {
                        // This callback is called frequently, so we don't set state here to avoid re-renders.
                    }
                );
                setIsScannerActive(true);
                setScanError(null);
            } catch (err) {
                console.error("Failed to start QR scanner", err);
                setScanError("Could not start camera. Please check permissions and refresh.");
                setIsScannerActive(false);
            }
        };
        
        startScanner();

        return () => {
            if (qrCode && qrCode.isScanning) {
                qrCode.stop().then(() => {
                    setIsScannerActive(false);
                }).catch(err => {
                    console.error("Failed to stop QR scanner gracefully", err);
                });
            }
        };
    }, []);

    const handleScanSuccess = (qrCode: string) => {
        if (scannedBin) return; 

        const foundBin = bins.find(b => b.qr_code === qrCode);
        if (foundBin) {
            setScannedBin(foundBin);
            setScanError(null);
            if (html5QrCodeRef.current?.isScanning) {
               html5QrCodeRef.current.stop();
               setIsScannerActive(false);
            }
        } else {
            setScanError(`Invalid QR Code. Bin not found.`);
            setTimeout(() => setScanError(null), 3000);
        }
    };

    const handleModalClose = () => {
        setScannedBin(null);
    };

    return (
        <div className="p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Scan Bin QR Code</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                Point your camera at the QR code on an e-waste bin to log items.
            </p>
            <div className="relative w-full max-w-sm border-4 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden aspect-square shadow-lg">
                <div id={SCANNER_ID}></div>
                {isScannerActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-[250px] h-[250px] border-4 border-emerald-500/70 rounded-lg" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}></div>
                    </div>
                )}
            </div>
            
            {scanError && <p className="mt-4 text-center text-red-500 font-semibold animate-pulse">{scanError}</p>}
            {!isScannerActive && !scanError && !scannedBin && (
                <p className="mt-4 text-center text-gray-500">Initializing camera...</p>
            )}
            
            {scannedBin && (
                <BinScanModal bin={scannedBin} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default ScanBinView;