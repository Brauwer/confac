import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ModalState} from '../../controls/Modal';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';
import {ConsultantSelect} from './ConsultantSelect';
import {ConsultantModel} from '../models/ConsultantModel';
import {ConsultantModal} from './ConsultantModal';
import {ConfacState} from '../../../reducers/app-state';
import {saveConsultant} from '../../../actions/consultantActions';


type SelectWithCreateModalProps<TModel> = {
  value?: string | TModel;
  onChange: (modelId: string, model: TModel) => void;
}


export const ConsultantSelectWithCreateModal = ({value, onChange}: SelectWithCreateModalProps<ConsultantModel>) => {
  const dispatch = useDispatch();
  const [modalId, setModalId] = useState<ModalState>(null);
  const consultant = useSelector((state: ConfacState) => state.consultants.find(c => c._id === value));

  return (
    <>
      {modalId && (
        <ConsultantModal
          consultant={modalId !== 'create' ? consultant : null}
          show={!!modalId}
          onClose={() => setModalId(null)}
          onConfirm={(model: ConsultantModel) => dispatch(saveConsultant(model, savedModel => onChange(savedModel._id, savedModel)))}
        />
      )}
      <div className="unset-split">
        <div>
          <ConsultantSelect
            label={t('project.consultant')}
            value={value || ''}
            onChange={(id, model) => onChange(id, model)}
          />
        </div>
        <div style={{width: 120, position: 'relative'}}>
          <Button
            onClick={() => setModalId('create')}
            variant="light"
            size="sm"
            style={{position: 'absolute', bottom: 18, left: 5}}
          >
            {t('add')}
          </Button>
        </div>
      </div>
    </>
  );
};
