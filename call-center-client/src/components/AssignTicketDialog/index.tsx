import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { assignTicketSchema } from '@/schemas/ticketSchema';
import type { AssignTicketFormValues } from '@/schemas/ticketSchema';
import { TaskPlatform } from '@/types';
import { LANGUAGES } from '@/constants';

type AssignTicketDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSubmit: (data: AssignTicketFormValues) => void;
};

export function AssignTicketDialog({
  open,
  onOpenChange,
  onFormSubmit,
}: AssignTicketDialogProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignTicketFormValues>({
    resolver: zodResolver(assignTicketSchema),
    defaultValues: {
      platform: TaskPlatform.WEBSITE_CHAT,
      restrictions: [''],
      id: crypto.randomUUID(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'restrictions',
  } as never);

  const handleFormSubmit = (data: AssignTicketFormValues) => {
    onFormSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('assignTicket.title')}</DialogTitle>
          <DialogDescription>{t('assignTicket.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">{t('assignTicket.platform')}</Label>
            <Controller
              control={control}
              name="platform"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="website_chat"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      Website Chat
                    </SelectItem>
                    <SelectItem
                      value="facebook_chat"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      Facebook Chat
                    </SelectItem>
                    <SelectItem
                      value="email"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      Email
                    </SelectItem>
                    <SelectItem
                      value="call"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      Call
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.platform && (
              <p className="text-sm text-red-500 mt-1">
                {errors.platform.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2">{t('assignTicket.restrictions')}</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-1 items-center">
                <Controller
                  control={control}
                  name={`restrictions.${index}`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem
                            className="cursor-pointer hover:bg-gray-100"
                            key={lang}
                            value={lang}
                          >
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(index)}
                  className="px-2"
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              className="mt-1 cursor-pointer"
              onClick={() => append('')}
            >
              + {t('assignTicket.addLanguage')}
            </Button>
            {errors.restrictions && (
              <p className="text-sm text-red-500 mt-1">
                {errors.restrictions.message as string}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button className="cursor-pointer" type="submit">
              {t('common.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
