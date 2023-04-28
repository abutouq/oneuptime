import React, { FunctionComponent, ReactElement } from 'react';

import { CriteriaIncident } from 'Common/Types/Monitor/CriteriaIncident';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import Incident from 'Model/Models/Incident';
import BasicForm from 'CommonUI/src/Components/Forms/BasicForm';
import { DropdownOption } from 'CommonUI/src/Components/Dropdown/Dropdown';
import FormValues from 'CommonUI/src/Components/Forms/Types/FormValues';

export interface ComponentProps {
    initialValue?: undefined | CriteriaIncident;
    onChange?: undefined | ((value: CriteriaIncident) => void);
    incidentSeverityDropdownOptions: Array<DropdownOption>;
    // onDelete?: undefined | (() => void);
}

const MonitorCriteriaIncidentForm: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <div className="mt-4">
            <BasicForm
                modelType={Incident}
                hideSubmitButton={true}
                initialValues={props.initialValue ? {
                    ...props.initialValue,
                    incidentSeverityId: props.incidentSeverityDropdownOptions.find((i)=> i.value.toString() === props.initialValue?.incidentSeverityId?.toString()!),
                }: {}}
                onChange={( values: FormValues<Incident>) => {
                    props.onChange && props.onChange(values as CriteriaIncident)
                }}
                disableAutofocus={true}
                fields={[
                    {
                        field: {
                            title: true,
                        },
                        title: 'Incident Title',
                        fieldType: FormFieldSchemaType.Text,
                        stepId: 'incident-details',
                        required: true,
                        placeholder: 'Incident Title',
                        validation: {
                            minLength: 2,
                        },
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Incident Description',
                        stepId: 'incident-details',
                        fieldType: FormFieldSchemaType.LongText,
                        required: true,
                        placeholder: 'Description',
                    },
                    {
                        field: {
                            incidentSeverityId: true,
                        },
                        title: 'Incident Severity',
                        stepId: 'incident-details',
                        description: 'What type of incident is this?',
                        fieldType: FormFieldSchemaType.Dropdown,
                        dropdownOptions: props.incidentSeverityDropdownOptions,
                        required: true,
                        placeholder: 'Incident Severity',
                    },
                ]}
            />

            {/* <div className='mt-4'>
                <Button
                    onClick={() => {
                        if (props.onDelete) {
                            props.onDelete();
                        }
                    }}
                    title="Delete"
                />
            </div> */}
        </div>
    );
};

export default MonitorCriteriaIncidentForm;
