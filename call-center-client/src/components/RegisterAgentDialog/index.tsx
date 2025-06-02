import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { agentSchema } from '@/schemas/agentSchema';
import type { AgentFormValues } from '@/schemas/agentSchema';
import { LANGUAGES } from '@/constants';

type RegisterAgentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSubmit: (data: AgentFormValues) => void;
};

export function RegisterAgentDialog(props: RegisterAgentDialogProps) {
  const { open, onOpenChange, onFormSubmit } = props;
  const { t } = useTranslation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: '',
      language_skills: [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'language_skills',
  } as never);
  const selectedLanguages = watch('language_skills');

  const onSubmit = (data: AgentFormValues) => {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('registerAgent.addNewAgent')}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">{t('registerAgent.name')}</Label>
            <Input {...register('name')} placeholder="Agent name" data-testid="agent-name"/>
            {errors.name && (
              <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('registerAgent.languageSkills')}</Label>
            {fields.map((field, index) => {
              const { id } = field as never;
              const currentValue = selectedLanguages?.[index];
              const availableLanguages = LANGUAGES.filter(
                (lang) =>
                  !selectedLanguages?.includes(lang) || lang === currentValue
              );

              return (
                <div key={id} className="flex gap-2 items-center">
                  <Select
                    value={currentValue}
                    onValueChange={(val) =>
                      setValue(`language_skills.${index}`, val)
                    }
                  >
                    <SelectTrigger className="w-full" data-testid="language-select-trigger">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent data-testid="language-options">
                      {availableLanguages.map((lang) => (
                        <SelectItem
                          className="cursor-pointer hover:bg-gray-100"
                          data-testid="language-option"
                          key={lang}
                          value={lang}
                        >
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            {errors.language_skills && (
              <p className="text-sm text-red-500 mt-2">
                {errors.language_skills.message as string}
              </p>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={() => append('')}
              className="mt-1 cursor-pointer"
            >
              + {t('registerAgent.addLanguage')}
            </Button>
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
            <Button type="submit" className="cursor-pointer" data-testid="submit-button">
              {t('registerAgent.register')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
