"use client";
import { scanReceipt } from "@/actions/transaction";
import useFetch from "@/app/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import React, { useRef } from "react";

const ReceiptScanner = ({ onScanComplete }) => {

    const fileInputRef = useRef(null);

    const {
        loading: scanReceiptLoading,
        func: scanReceiptFunc,
        data: scannedData,
    } = useFetch(scanReceipt);

    const handleReceiptScan = () => { };

    const handleChnage = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleReceiptScan(file);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                className='hidden'
                accept="image/*"
                capture="environment"
                onChange={handleChnage}
            />
            <Button className="custom-ai-button animate-gradient"
            onClick={()=>fileInputRef.current}
            disabled={scanReceiptLoading}
            >
                {scanReceiptLoading ? (
                    <>
                        <Loader2 className="mr-2 animate-spin" />
                        <span>Scanning please wait...</span>
                    </>
                ) : (
                    <>
                        <Camera className="mr-2 " />
                        <span>Scan Receipt with AI</span>
                    </>
                )}
            </Button>
        </div>
    );
};

export default ReceiptScanner
