﻿using SPM.Api.Services.MQTT.Models;

namespace SPM.Api.Services.MQTT
{
    public interface IMQTTService
    {
        Task<bool> SetRelayStatus(string customerId, bool activate, bool isAdminCommand);

        Task<GetRelayStatusResponse> GetRelayStatus(string customerId);
    }
}
