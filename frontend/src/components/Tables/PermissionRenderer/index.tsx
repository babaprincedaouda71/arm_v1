import WheelIcon from '@/components/Svgs/WheelIcon'
import {PermissionConfigProps} from '@/types/Table.types'
import React from 'react'

const PermissionRenderer: React.FC<PermissionConfigProps & { onClick?: () => void }> = ({
                                                                                            value,
                                                                                            permissionConfig,
                                                                                            onClick
                                                                                        }) => {
    const config = permissionConfig[value] || {
        label: value,
        color: '#FFFFFF',
        backgroundColor: 'bg-gradient-to-b from-gradientGreenStart to-gradientGreenEnd'
    }

    return (
        <div className="flex justify-center items-center">
            <div
                className={`flex items-center py-[8px] px-[16px] rounded-lg ${config.color} ${config.backgroundColor}`}
                style={{
                    color: config.color,
                    backgroundColor: config.backgroundColor,
                    cursor: value === "_" ? 'pointer' : 'default'
                }}
                onClick={value === "_" ? onClick : undefined} // Seulement cliquable pour "Gérer l'accès"
            >
                {config.icon && <span className="mr-2">{config.icon}</span>}
                {config.label}
                {config.showIcon && (
                    <WheelIcon className='ml-2'/>
                )}
            </div>
        </div>
    )
}

export default PermissionRenderer