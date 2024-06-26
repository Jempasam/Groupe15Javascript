import type { IDisposable } from "../scene";
import { DeviceType } from "./InputDevices/deviceEnums";
import type { Observable } from "../Misc/observable";
import type { IDeviceInputSystem } from "./inputInterfaces";
import { DeviceSource } from "./InputDevices/deviceSource";
import type { IUIEvent } from "../Events/deviceInputEvents";
import type { AbstractEngine } from "../Engines/abstractEngine";
type Distribute<T> = T extends DeviceType ? DeviceSource<T> : never;
export type DeviceSourceType = Distribute<DeviceType>;
declare module "../Engines/abstractEngine" {
    interface AbstractEngine {
        /** @internal */
        _deviceSourceManager?: InternalDeviceSourceManager;
    }
}
/** @internal */
export interface IObservableManager {
    onDeviceConnectedObservable: Observable<DeviceSourceType>;
    onDeviceDisconnectedObservable: Observable<DeviceSourceType>;
    _onInputChanged(deviceType: DeviceType, deviceSlot: number, eventData: IUIEvent): void;
    _addDevice(deviceSource: DeviceSource<DeviceType>): void;
    _removeDevice(deviceType: DeviceType, deviceSlot: number): void;
}
/** @internal */
export declare class InternalDeviceSourceManager implements IDisposable {
    readonly _deviceInputSystem: IDeviceInputSystem;
    private readonly _devices;
    private readonly _registeredManagers;
    _refCount: number;
    constructor(engine: AbstractEngine);
    readonly registerManager: (manager: IObservableManager) => void;
    readonly unregisterManager: (manager: IObservableManager) => void;
    dispose(): void;
}
export {};
