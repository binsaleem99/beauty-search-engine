"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"

export function PaywallModal({
    isOpen,
    onClose,
    triggerLabel = "Unlock Premium"
}: {
    isOpen: boolean;
    onClose: () => void;
    triggerLabel?: string;
}) {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (plan: 'monthly' | 'annual') => {
        setLoading(true);
        try {
            const res = await fetch('/api/subscription/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            });
            const data = await res.json();

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                alert("Checkout failed: " + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Unlock Premium Features</DialogTitle>
                    <DialogDescription className="text-center">
                        Get exclusive access to ingredient analysis and price alerts.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>Detailed Ingredient Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>Price Drop Alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>Unlimited Favorites</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="flex flex-col h-auto py-4" onClick={() => handleSubscribe('monthly')} disabled={loading}>
                        <span className="font-bold">5 KWD</span>
                        <span className="text-xs text-muted-foreground">/Month</span>
                    </Button>
                    <Button className="flex flex-col h-auto py-4 bg-gradient-to-r from-pink-500 to-rose-500 border-0" onClick={() => handleSubscribe('annual')} disabled={loading}>
                        <span className="font-bold">40 KWD</span>
                        <span className="text-xs text-white/80">/Year</span>
                        <span className="text-[10px] bg-white/20 px-1 rounded mt-1">Save 10 KWD</span>
                    </Button>
                </div>

                <DialogFooter className="sm:justify-center">
                    <p className="text-xs text-muted-foreground text-center mt-4">
                        Secure payment via Tap. Cancel anytime.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
