﻿using FactorioWebInterface.Data;
using FactorioWrapperInterface;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace FactorioWebInterface.Models
{
    public interface IFactorioServerManager
    {
        Task<Result> Resume(string serverId, string userName);
        Task<Result> Load(string serverId, string saveFilePath, string userName);
        Task<Result> Stop(string serverId, string userName);
        Task<Result> ForceStop(string serverId, string userName);
        Task<FactorioServerStatus> GetStatus(string serverId);
        Task RequestStatus(string serverId);
        Task<MessageData[]> GetFactorioControlMessagesAsync(string serverId);
        Task SendToFactorioProcess(string serverId, string data);
        void FactorioDataReceived(string serverId, string data);
        void FactorioWrapperDataReceived(string serverId, string data);
        Task OnProcessRegistered(string serverId);
        Task StatusChanged(string serverId, FactorioServerStatus newStatus, FactorioServerStatus oldStatus);
        Task<List<Regular>> GetRegularsAsync();
        Task AddRegularsFromStringAsync(string data);
        FileMetaData[] GetLocalSaveFiles(string serverId);
        FileMetaData[] GetTempSaveFiles(string serverId);
        FileMetaData[] GetGlobalSaveFiles();
        FileInfo GetFile(string directory, string fileName);
    }
}