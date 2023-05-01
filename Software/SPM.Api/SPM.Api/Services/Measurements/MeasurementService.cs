﻿using SPM.Api.Core.Extensions;
using SPM.Api.Core.Domain.Enums;
using SPM.Api.Services.InfluxDb;
using SPM.Api.Services.InfluxDb.Models;
using SPM.Api.Services.Measurements.Models;

namespace SPM.Api.Services.Measurements
{
    public class MeasurementService : IMeasurementService
    {
        private readonly IInfluxDbService _influxDbService;

        public MeasurementService(IInfluxDbService influxDbService)
        {
            _influxDbService = influxDbService;
        }

        public async Task<IEnumerable<MeasurementModel>> GetMeasurement(MeasurementType measurement, TimeRange timeRange, AggregateDuration duration)
        {
            var currentDate = DateTimeOffset.Now;
            var data = await _influxDbService.GetMeasurement(measurement.ToString(), currentDate.StartTime(timeRange), currentDate, duration.ToStringDuration());

            return data;
        }

        public async Task<IEnumerable<MeasurementModel>> GetRecentMeasurement(MeasurementType measurement, TimeType timeType, int time)
        {
            var data = await _influxDbService.GetRecentMeasurement(measurement.ToString(), GetTime(timeType, time), GetDuration(timeType, time));

            return data;
        }

        public async Task<GetMonthlyEnergyConsumptionResponse> GetMonthlyEnergyConsumption()
        {
            var currentDate = DateTimeOffset.Now;
            var data = await _influxDbService.GetMeasurement("Energy", currentDate.StartTime(TimeRange.Month), currentDate, AggregateDuration.Hour.ToStringDuration());

            var last = data.Where(x => x.Value != 0).Last().Value;
            var first = data.Where(x => x.Value != 0).Min(x => x.Value);
            var consumedEnergy = last - first;

            var tariff = GetTariff(consumedEnergy);
            var cost = consumedEnergy * tariff;

            return new GetMonthlyEnergyConsumptionResponse
            {
                TotalConsumedEnergy = Math.Round(consumedEnergy, 2),
                TotalCost = Math.Round(cost, 2)
            };
        }

        private string GetTime(TimeType timeType, int time)
        {
            return timeType switch
            {
                TimeType.Minute => $"{time}m",
                TimeType.Hour => $"{time}h",
                _ => "",
            };
        }

        private int GetDuration(TimeType timeType, int time)
        {
            var windowSize = 30;

            switch (timeType)
            {
                case TimeType.Minute:
                    return time * 60 / windowSize;
                case TimeType.Hour:
                    return time * 3600 / windowSize;
                default:
                    return 0;
            }
        }

        private double GetTariff(double consumedEnergy)
        {
            if (consumedEnergy >= 0 && consumedEnergy <= 101)
                return 0.18041;
            else if (consumedEnergy >= 101 && consumedEnergy <= 301)
                return 0.22053;
            else
                return 0.26537;
        }
    }
}
