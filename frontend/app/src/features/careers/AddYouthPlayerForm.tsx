import { useToast } from '../../components/ui/toastContext';
import { messages } from '../../i18n/pt-BR';
import { addYouthPlayer } from '../../lib/api/client';
import { PlayerForm } from './PlayerForm';

export function AddYouthPlayerForm({
  careerSquadId,
  onClose,
  onAdded,
}: {
  careerSquadId: number;
  onClose: () => void;
  onAdded: () => void;
}) {
  const { showToast } = useToast();

  return (
    <PlayerForm
      submitLabel={messages.youth.addSubmit}
      submittingLabel={messages.youth.adding}
      errorMessage={messages.youth.addError}
      onSave={async (values) => {
        await addYouthPlayer({
          ...values,
          countryId: values.countryId === '' ? null : Number(values.countryId),
          careerSquadId,
        });

        showToast(messages.youth.addSuccess);
        onAdded();
        onClose();
      }}
    />
  );
}
