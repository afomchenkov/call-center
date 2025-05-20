import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { agentSchema } from '@/schemas/agentSchema';
import type { AgentFormValues } from '@/schemas/agentSchema';

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
    formState: { errors },
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

  const onSubmit = (data: AgentFormValues) => {
    onFormSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={'Register new agent'}>
        <DialogHeader>
          <DialogTitle>{t('registerAgent.addNewAgent')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">{t('registerAgent.name')}</Label>
            <Input {...register('name')} placeholder="Agent name" />
            {errors.name && (
              <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('registerAgent.languageSkills')}</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`language_skills.${index}`)}
                  placeholder="e.g. English"
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
            ))}

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
              {t('registerAgent.addLanguage')}
            </Button>
          </div>

          <DialogFooter>
            <Button type="submit" className="cursor-pointer">
              {t('registerAgent.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
