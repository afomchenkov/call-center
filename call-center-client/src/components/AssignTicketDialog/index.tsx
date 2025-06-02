import { useEffect } from 'react';
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
import { LANGUAGES, AVAILABLE_CHANNELS } from '@/constants';

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
    watch,
  } = useForm<AssignTicketFormValues>({
    resolver: zodResolver(assignTicketSchema),
    defaultValues: {
      platform: TaskPlatform.WEBSITE_CHAT,
      restrictions: [''],
      id: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        platform: TaskPlatform.WEBSITE_CHAT,
        restrictions: [''],
        id: crypto.randomUUID(),
      });
    }
  }, [open, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'restrictions',
  } as never);
  const selectedLangRestrictions = watch('restrictions');

  const handleFormSubmit = (data: AssignTicketFormValues) => {
    onFormSubmit(data);
    reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent aria-describedby={undefined}>
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
                <Select value={field.value} onValueChange={field.onChange} data-testid="platform">
                  <SelectTrigger className="w-full" data-testid="platform-select-trigger">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent data-testid="platform-options">
                    {AVAILABLE_CHANNELS.map(({ name, value }) => {
                      return (
                        <SelectItem
                          data-testid="platform-option"
                          key={value}
                          value={value}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {name}
                        </SelectItem>
                      );
                    })}
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

            {fields.map((field, index) => {
              const { id } = field as never;
              const currentValue = selectedLangRestrictions?.[index];
              const availableLanguages = LANGUAGES.filter(
                (lang) =>
                  !selectedLangRestrictions?.includes(lang) ||
                  lang === currentValue
              );

              return (
                <div key={id} className="flex gap-2 mb-1 items-center">
                  <Controller
                    control={control}
                    name={`restrictions.${index}`}
                    render={({ field }) => (
                      <Select
                        data-testid="language-select"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full" data-testid="language-select-trigger">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent data-testid="language-options">
                          {availableLanguages.map((lang) => (
                            <SelectItem
                              data-testid="language-option"
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
                    className="px-2 cursor-pointer"
                  >
                    ✕
                  </Button>
                </div>
              );
            })}

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
              onClick={() => handleOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button className="cursor-pointer" type="submit" data-testid="submit-button">
              {t('common.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
