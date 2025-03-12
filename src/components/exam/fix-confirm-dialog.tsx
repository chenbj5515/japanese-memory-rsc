import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useTranslations } from 'next-intl';

interface ConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function FixConfirmDialog({
    open,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const t = useTranslations('exam');

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
                    <DialogTitle>{t('fix_confirm.description')}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button className='w-[100px]' variant="default" onClick={handleConfirm}>
                        {t('fix_confirm.confirm')}
                    </Button>
                    <Button className='w-[100px] ml-[20px]' variant="secondary" onClick={handleCancel}>
                        {t('fix_confirm.cancel')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}