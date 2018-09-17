﻿using System.Threading.Tasks;

namespace FactorioWebInterface.Models
{
    public interface IFactorioControlServerMethods
    {
        Task SetServerId(int serverId);
        Task Start();
        Task Load(string saveFilePath);
        Task Stop();
        Task ForceStop();
        Task<FactorioServerStatus> GetStatus();
        Task SendToFactorio(string data);
    }

    public interface IFactorioControlClientMethods
    {
        Task FactorioOutputData(string data);
        Task FactorioWrapperOutputData(string data);
        Task FactorioWebInterfaceData(string data);
    }
}
