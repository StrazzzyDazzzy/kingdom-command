import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BookingPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function BookingPopup({ open, onClose }: BookingPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative glass-strong rounded-2xl p-8 w-full max-w-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              aria-label="Close booking popup"
              className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-semibold mb-2">Book Your Demo</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in your details and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-[hsl(var(--gold)/0.5)] focus:border-[hsl(var(--gold))] outline-none transition-shadow"
              />
              <input
                type="email"
                placeholder="Work Email"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-[hsl(var(--gold)/0.5)] focus:border-[hsl(var(--gold))] outline-none transition-shadow"
              />
              <input
                type="text"
                placeholder="Company"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-[hsl(var(--gold)/0.5)] focus:border-[hsl(var(--gold))] outline-none transition-shadow"
              />
              <button
                type="submit"
                className="btn-interactive w-full rounded-lg bg-[hsl(var(--gold))] px-6 py-3 text-sm font-semibold text-black hover:shadow-[0_0_20px_hsl(var(--gold)/0.4)]"
              >
                Request Demo
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
