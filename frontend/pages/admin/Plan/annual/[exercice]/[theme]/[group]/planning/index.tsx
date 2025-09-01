import React, { useState } from 'react'
import InputField from '@/components/FormComponents/InputField';
import MultiSelectField from '@/components/FormComponents/MultiselectField';
import CustomSelect from '@/components/FormComponents/CustomSelect';
import MultipleInputField from '@/components/FormComponents/MultipleInputField';

const Planning = () => {
    const [formValues, setFormValues] = useState({
        type: "",
        fromMorning: "",
        fromAfternoon: "",
        toMorning: "",
        toAfternoon: "",
    });

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [name]: e.target.value });
    };

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange2 = (event) => {
        const { name, value } = event;

        // Mettre à jour l'état formData avec la nouvelle valeur
        setFormValues((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const [departmentSelectedOptions, setDepartmentSelectedOptions] = useState<string[]>([]);

    return (
        <form>
            <div className='grid md:grid-cols-2 md:gap-10 gap-4'>
                {/*<InputField label={'Site'} name={'site'} onChange={() => null} />*/}
                <MultiSelectField label={'Département'} options={["IT", "RH"]} value={departmentSelectedOptions} onChange={setDepartmentSelectedOptions} />
                {/*<InputField label={'Lieu'} name={'location'} onChange={() => null} />*/}
                <MultiSelectField label={'Qualification'} options={[]} value={[]} onChange={() => null} />
                {/*<InputField label={'Ville'} name={'city'} onChange={() => null} />*/}
                {/*<MultipleInputField label={'Validité'} fromFields={[*/}
                {/*    {*/}
                {/*        label: '',*/}
                {/*        name: 'fromDate',*/}
                {/*        type: 'date',*/}
                {/*        value: '',*/}
                {/*        onChange: () => null*/}
                {/*    }*/}
                {/*]} toFields={[{*/}
                {/*    label: '',*/}
                {/*    name: 'toDate',*/}
                {/*    type: 'date',*/}
                {/*    value: '',*/}
                {/*    onChange: () => null*/}
                {/*}]} pauseLabel="" />*/}
                {/* <InputField label={'Validité'} name={'validity'} onChange={() => null} /> */}
                <CustomSelect label='Type' name='type' options={['Interne', 'Externe']} value={formValues.type} onChange={handleChange2} />
                <MultipleInputField
                    label="Horaires"
                    fromFields={[
                        {
                            label: "De",
                            name: "fromMorning",
                            type: "time",
                            value: formValues.fromMorning,
                            onChange: handleChange("fromMorning"),
                        },
                        {
                            label: "À",
                            name: "toMorning",
                            type: "time",
                            value: formValues.toMorning,
                            onChange: handleChange("toMorning"),
                        },
                    ]}
                    toFields={[
                        {
                            label: "De",
                            name: "fromAfternoon",
                            type: "time",
                            value: formValues.fromAfternoon,
                            onChange: handleChange("fromAfternoon"),
                        },
                        {
                            label: "À",
                            name: "toAfternoon",
                            type: "time",
                            value: formValues.toAfternoon,
                            onChange: handleChange("toAfternoon"),
                        },
                    ]}
                />
                {/*<MultipleInputField label={'Date'} fromFields={[*/}
                {/*    {*/}
                {/*        label: '',*/}
                {/*        name: 'fromDate',*/}
                {/*        type: 'date',*/}
                {/*        value: '',*/}
                {/*        onChange: () => null*/}
                {/*    }*/}
                {/*]} toFields={[{*/}
                {/*    label: '',*/}
                {/*    name: 'toDate',*/}
                {/*    type: 'date',*/}
                {/*    value: '',*/}
                {/*    onChange: () => null*/}
                {/*}]} pauseLabel="" />*/}
            </div>
            {/* Bouton Enregistrer */}
            <div className="flex justify-end mt-4">
                <button
                    type='button'
                    className="px-6 py-2 bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white rounded-md hover:bg-violet-700 transition-colors"
                    onClick={() => null}
                >
                    Enregistrer
                </button>
            </div>
        </form>
    )
}

export default Planning