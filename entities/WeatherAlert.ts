import { ReactNode } from 'react';

export interface WeatherAlertInterface {
    type: string;
    message: string;
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    icon?: any; // ReactNode is tricky in entities if not using JSX, but we can use any for now or string
    advisory: string[];
    location: string;
}

export class WeatherAlert {
    static async filter(criteria: { location: string }): Promise<WeatherAlertInterface[]> {
        // Mock data
        return [
            {
                type: 'Heavy Rainfall',
                message: `Heavy rainfall expected in ${criteria.location} tomorrow.`,
                severity: 'high',
                advisory: ['Ensure drainage', 'Protect harvested crops'],
                location: criteria.location
            }
        ];
    }
}
