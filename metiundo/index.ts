// Please use axios for your API requests
import axios, { AxiosError } from "axios";
import { authenticate, getMeteringPoints, getElectricityReadings } from "./api";

// Find the docs at https://api.metiundo.de/v1/docs
// const baseUrl = "https://api.metiundo.de/v1";

type MetricsResult = {
    totalEnergyConsumed: number;
    maxPower: number;
};

export const calculateMetrics = async (): Promise<MetricsResult> => {
    try {
        const token = await authenticate();
        const meteringPoints = await getMeteringPoints(token);

        if (meteringPoints.length === 0) {
            console.log('No metering points available.');
            return { totalEnergyConsumed: 0, maxPower: 0 };
        }

        const meterId = meteringPoints[0].uuid;
        const from = new Date('2023-07-01T00:00:00Z').getTime();
        const to = new Date('2023-07-31T23:59:59Z').getTime();
        const readings = await getElectricityReadings(token, meterId, from, to);

        if (readings.length === 0) {
            console.log('No readings available for the specified time period.');
            return { totalEnergyConsumed: 0, maxPower: 0 };
        }

        let totalEnergyConsumed = 0;
        let maxPower = 0;

        readings.forEach(reading => {
            const energyConsumedKWh = reading.energyOut / 1000;
            totalEnergyConsumed += energyConsumedKWh;
            const power = energyConsumedKWh / (15 / 60);
            maxPower = Math.max(maxPower, power);
        });

        return { totalEnergyConsumed, maxPower };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Axios error occurred:', axiosError.message);
            if (axiosError.response) {
                console.error('Response data:', axiosError.response.data);
                console.error('Response status:', axiosError.response.status);
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
            }
        } else {
            console.error('Error occurred:', (error as Error).message);
        }
        return { totalEnergyConsumed: 0, maxPower: 0 };
    }
};


const main = async () => {
  try {
    const result = await calculateMetrics();

    if (result) {
      const { totalEnergyConsumed, maxPower } = result;
      console.log("July 2023 Metrics:")
      console.log(
        `Total Electricity Consumption: ${totalEnergyConsumed.toFixed(
          2
        )} kWh`
      );
      console.log(
        `Maximum Power Measured: ${maxPower.toFixed(2)} kW`
      );
      console.log("Calculation completed successfully.");
    } else {
      console.log("Calculation did not produce valid results.");
    }
  } catch (error) {
    console.error("Error occurred during calculation:", error);
  }
};

main();
