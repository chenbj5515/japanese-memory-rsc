import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface ConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

export function FixConfirmDialog({
    open,
    onConfirm,
    onCancel,
    title = "この結果は正しいと確信されていますか？",
    confirmLabel = "はい",
    cancelLabel = "キャンセル"
}: ConfirmDialogProps) {
    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        onConfirm();
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCancel();
    };

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent aria-describedby='' onClick={(e) => e.stopPropagation()}>
                <DialogHeader className='p-3'>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button className='w-[100px]' variant="default" onClick={handleConfirm}>
                        {confirmLabel}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                        {cancelLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}