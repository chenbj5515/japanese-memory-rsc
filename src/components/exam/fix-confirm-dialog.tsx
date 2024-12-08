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
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent aria-describedby=''>
                <DialogHeader className='p-3'>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button className='w-[100px]' variant="default" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}