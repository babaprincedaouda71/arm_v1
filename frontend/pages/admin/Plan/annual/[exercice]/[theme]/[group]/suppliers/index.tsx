import CustomSelect from '@/components/FormComponents/CustomSelect';
import FileInputField from '@/components/FormComponents/FileInputField';
import InputField from '@/components/FormComponents/InputField';
import RadioGroup from '@/components/FormComponents/RadioGroup'
import TextAreaField from '@/components/FormComponents/TextAreaField';
import React, { useState } from 'react'

const Suppliers = () => {
  const [selected, setSelected] = useState("internal");

  const options = [
    { id: "internal", value: "internal", label: "Interne" },
    { id: "external", value: "external", label: "Externe" }
  ];

  // Gestionnaire de changement
  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  // Fonction pour rendre le contenu conditionnel
  const renderContent = () => {
    switch (selected) {
      case "internal":
        return (
          <div className='grid md:grid-cols-1 md:gap-10 gap-5'>
            <CustomSelect label='Formateur' options={["Formateur 1", "Formateur 2", "Formateur 3"]} value={''} onChange={() => null} />
            <TextAreaField label='Commentaire' name='comment' onChange={() => null} />
            <div className='flex gap-5 items-center'>
              <label>Envoyer une invitation au formateur</label>
              <button
                type="button"
                className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold py-2 px-6 md:p-3 lg:p-4 rounded-xl"
                onClick={() => alert("MyEvaluationsComponent ajoutée avec succès")}
              >
                Envoyer
              </button>
            </div>
            <div className='flex gap-5 items-center'>
              <label>État de confirmation</label>
              <button
                type="button"
                className="bg-gradient-to-b from-gradientYellowStart to-gradientYellowEnd hover:bg-gradientYellowEnd text-black font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                onClick={() => alert("MyEvaluationsComponent ajoutée avec succès")}
              >
                En attente de confirmation
              </button>
            </div>
          </div>
        );
      case "external":
        return (
          <div className='grid md:grid-cols-1 md:gap-10 gap-5'>
            <CustomSelect label='OCF' options={["OCF 1", "OCF 2", "OCF 3"]} value={''} onChange={() => null} />
            {/*<InputField label="Nom Formateur" name="trainer" onChange={() => null} />*/}
            {/*<InputField label="Email" name="trainerEmail" onChange={() => null} />*/}
            <FileInputField label="CV Formateur" name="cv" onChange={() => null} />
            <label className='text-primary font-bold text-center'>Demander l'affectation d'un formateur</label>
            {/*<InputField type='number' label="Coût total de la formation" name="cost" onChange={() => null} />*/}
            <label className='text-primary font-bold text-center'>Demande de devis</label>
          </div>
        );
      default:
        return null; // Aucun contenu si rien n'est sélectionné
    }
  };
  return (
    <form>
      <RadioGroup
        groupLabel="Veuillez choisir le type de formation"
        options={options}
        name="type"
        selectedValue={selected}
        onChange={(e) => setSelected(e.target.value)} />
      {/* Zone de contenu conditionnel */}
      <div className="mt-6 lg:px-80">
        {renderContent()}
      </div>
    </form>
  )
}

export default Suppliers