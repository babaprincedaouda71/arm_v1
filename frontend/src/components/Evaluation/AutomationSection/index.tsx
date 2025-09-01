import React, { useState } from 'react'
import Toggle from '../Toggle'
import InputField from '../../FormComponents/InputField';
import CustomSelect from '../../FormComponents/CustomSelect';

interface AutomationSectionProps {
    onAutomationChange?: (settings: AutomationSettings) => void;
}


export interface AutomationSettings {
    enabled: boolean;
    time: string;
    days: string;
    timing: 'before' | 'after';
    smsEnabled: boolean;
}

const index: React.FC<AutomationSectionProps> = ({ onAutomationChange }) => {
    const [settings, setSettings] = useState<AutomationSettings>({
        enabled: false,
        time: '17h',
        days: '5',
        timing: 'before',
        smsEnabled: false
    });

    const handleSettingChange = (updates: Partial<AutomationSettings>) => {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        onAutomationChange?.(newSettings);
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-6">Automatisation</h2>

            <div className="space-y-6">
                {/* Toggle principal */}
                <Toggle
                    enabled={settings.enabled}
                    onChange={(enabled) => handleSettingChange({ enabled })}
                    label="Activer l'envoi automatique pour ce modèle d'évaluation"
                />

                {settings.enabled && (
                    <>
                        {/* Configuration du timing */}
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">A</span>
                            {/*<InputField*/}
                            {/*    type="text"*/}
                            {/*    value={settings.time}*/}
                            {/*    onChange={(e) => handleSettingChange({ time: e.target.value })} label={''} name={''}                          />*/}

                            {/*<span className="text-gray-600">Nombre de jours</span>*/}
                            {/*<InputField*/}
                            {/*    type="text"*/}
                            {/*    value={settings.days}*/}
                            {/*    onChange={(e) => handleSettingChange({ days: e.target.value })}*/}
                            {/*    label=''*/}
                            {/*    name=''*/}
                            {/*/>*/}

                            {/*<CustomSelect name={""} options={["Avant", "Après"]} value={undefined} onChange={(e) => handleSettingChange({ timing: e.target.value as 'before' | 'after' })} className={undefined} label={""}/>*/}

                            {/*<CustomSelect name={""} options={["La date de début de la session de formation"]} value={undefined} onChange={(e) => handleSettingChange({ timing: e.target.value as 'before' | 'after' })} className={undefined} label={""}/>*/}

                        </div>

                        {/* Toggle SMS */}
                        <Toggle
                            enabled={settings.smsEnabled}
                            onChange={(smsEnabled) => handleSettingChange({ smsEnabled })}
                            label="Notifications par SMS"
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default index