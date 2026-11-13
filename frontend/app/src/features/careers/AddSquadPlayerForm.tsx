import { useToast } from '../../components/ui/toastContext';
import { messages } from '../../i18n/pt-BR';
import { addSquadPlayer } from '../../lib/api/client';
import { PlayerForm } from './PlayerForm';

export function AddSquadPlayerForm({
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
      submitLabel={messages.squad.addSubmit}
      submittingLabel={messages.squad.adding}
      errorMessage={messages.squad.addError}
      onSave={async (values) => {
        await addSquadPlayer({
          ...values,
          countryId: values.countryId === '' ? null : Number(values.countryId),
          careerSquadId,
        });

        showToast(messages.squad.addSuccess);
        onAdded();
        onClose();
      }}
    />
  );
}
