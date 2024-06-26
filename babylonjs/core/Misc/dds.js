/* eslint-disable @typescript-eslint/naming-convention */
import { Scalar } from "../Maths/math.scalar.js";
import { SphericalPolynomial } from "../Maths/sphericalPolynomial.js";

import { InternalTexture, InternalTextureSource } from "../Materials/Textures/internalTexture.js";
import { Logger } from "../Misc/logger.js";
import { CubeMapToSphericalPolynomialTools } from "../Misc/HighDynamicRange/cubemapToSphericalPolynomial.js";
import { BaseTexture } from "../Materials/Textures/baseTexture.js";
import { FromHalfFloat, ToHalfFloat } from "./textureTools.js";
import "../Engines/AbstractEngine/abstractEngine.cubeTexture.js";
import "../Engines/Extensions/engine.cubeTexture.js";
import { ThinEngine } from "../Engines/thinEngine.js";
// Based on demo done by Brandon Jones - http://media.tojicode.com/webgl-samples/dds.html
// All values and structures referenced from:
// http://msdn.microsoft.com/en-us/library/bb943991.aspx/
const DDS_MAGIC = 0x20534444;
const //DDSD_CAPS = 0x1,
//DDSD_HEIGHT = 0x2,
//DDSD_WIDTH = 0x4,
//DDSD_PITCH = 0x8,
//DDSD_PIXELFORMAT = 0x1000,
DDSD_MIPMAPCOUNT = 0x20000;
//DDSD_LINEARSIZE = 0x80000,
//DDSD_DEPTH = 0x800000;
// var DDSCAPS_COMPLEX = 0x8,
//     DDSCAPS_MIPMAP = 0x400000,
//     DDSCAPS_TEXTURE = 0x1000;
const DDSCAPS2_CUBEMAP = 0x200;
// DDSCAPS2_CUBEMAP_POSITIVEX = 0x400,
// DDSCAPS2_CUBEMAP_NEGATIVEX = 0x800,
// DDSCAPS2_CUBEMAP_POSITIVEY = 0x1000,
// DDSCAPS2_CUBEMAP_NEGATIVEY = 0x2000,
// DDSCAPS2_CUBEMAP_POSITIVEZ = 0x4000,
// DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x8000,
// DDSCAPS2_VOLUME = 0x200000;
const //DDPF_ALPHAPIXELS = 0x1,
//DDPF_ALPHA = 0x2,
DDPF_FOURCC = 0x4, DDPF_RGB = 0x40, 
//DDPF_YUV = 0x200,
DDPF_LUMINANCE = 0x20000;
function FourCCToInt32(value) {
    return value.charCodeAt(0) + (value.charCodeAt(1) << 8) + (value.charCodeAt(2) << 16) + (value.charCodeAt(3) << 24);
}
function Int32ToFourCC(value) {
    return String.fromCharCode(value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
}
const FOURCC_DXT1 = FourCCToInt32("DXT1");
const FOURCC_DXT3 = FourCCToInt32("DXT3");
const FOURCC_DXT5 = FourCCToInt32("DXT5");
const FOURCC_DX10 = FourCCToInt32("DX10");
const FOURCC_D3DFMT_R16G16B16A16F = 113;
const FOURCC_D3DFMT_R32G32B32A32F = 116;
const DXGI_FORMAT_R32G32B32A32_FLOAT = 2;
const DXGI_FORMAT_R16G16B16A16_FLOAT = 10;
const DXGI_FORMAT_B8G8R8X8_UNORM = 88;
const headerLengthInt = 31; // The header length in 32 bit ints
// Offsets into the header array
const off_magic = 0;
const off_size = 1;
const off_flags = 2;
const off_height = 3;
const off_width = 4;
const off_mipmapCount = 7;
const off_pfFlags = 20;
const off_pfFourCC = 21;
const off_RGBbpp = 22;
const off_RMask = 23;
const off_GMask = 24;
const off_BMask = 25;
const off_AMask = 26;
// var off_caps1 = 27;
const off_caps2 = 28;
// var off_caps3 = 29;
// var off_caps4 = 30;
const off_dxgiFormat = 32;
/**
 * Class used to provide DDS decompression tools
 */
export class DDSTools {
    /**
     * Gets DDS information from an array buffer
     * @param data defines the array buffer view to read data from
     * @returns the DDS information
     */
    static GetDDSInfo(data) {
        const header = new Int32Array(data.buffer, data.byteOffset, headerLengthInt);
        const extendedHeader = new Int32Array(data.buffer, data.byteOffset, headerLengthInt + 4);
        let mipmapCount = 1;
        if (header[off_flags] & DDSD_MIPMAPCOUNT) {
            mipmapCount = Math.max(1, header[off_mipmapCount]);
        }
        const fourCC = header[off_pfFourCC];
        const dxgiFormat = fourCC === FOURCC_DX10 ? extendedHeader[off_dxgiFormat] : 0;
        let textureType = 0;
        switch (fourCC) {
            case FOURCC_D3DFMT_R16G16B16A16F:
                textureType = 2;
                break;
            case FOURCC_D3DFMT_R32G32B32A32F:
                textureType = 1;
                break;
            case FOURCC_DX10:
                if (dxgiFormat === DXGI_FORMAT_R16G16B16A16_FLOAT) {
                    textureType = 2;
                    break;
                }
                if (dxgiFormat === DXGI_FORMAT_R32G32B32A32_FLOAT) {
                    textureType = 1;
                    break;
                }
        }
        return {
            width: header[off_width],
            height: header[off_height],
            mipmapCount: mipmapCount,
            isFourCC: (header[off_pfFlags] & DDPF_FOURCC) === DDPF_FOURCC,
            isRGB: (header[off_pfFlags] & DDPF_RGB) === DDPF_RGB,
            isLuminance: (header[off_pfFlags] & DDPF_LUMINANCE) === DDPF_LUMINANCE,
            isCube: (header[off_caps2] & DDSCAPS2_CUBEMAP) === DDSCAPS2_CUBEMAP,
            isCompressed: fourCC === FOURCC_DXT1 || fourCC === FOURCC_DXT3 || fourCC === FOURCC_DXT5,
            dxgiFormat: dxgiFormat,
            textureType: textureType,
        };
    }
    static _GetHalfFloatAsFloatRGBAArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, lod) {
        const destArray = new Float32Array(dataLength);
        const srcData = new Uint16Array(arrayBuffer, dataOffset);
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcPos = (x + y * width) * 4;
                destArray[index] = FromHalfFloat(srcData[srcPos]);
                destArray[index + 1] = FromHalfFloat(srcData[srcPos + 1]);
                destArray[index + 2] = FromHalfFloat(srcData[srcPos + 2]);
                if (DDSTools.StoreLODInAlphaChannel) {
                    destArray[index + 3] = lod;
                }
                else {
                    destArray[index + 3] = FromHalfFloat(srcData[srcPos + 3]);
                }
                index += 4;
            }
        }
        return destArray;
    }
    static _GetHalfFloatRGBAArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, lod) {
        if (DDSTools.StoreLODInAlphaChannel) {
            const destArray = new Uint16Array(dataLength);
            const srcData = new Uint16Array(arrayBuffer, dataOffset);
            let index = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcPos = (x + y * width) * 4;
                    destArray[index] = srcData[srcPos];
                    destArray[index + 1] = srcData[srcPos + 1];
                    destArray[index + 2] = srcData[srcPos + 2];
                    destArray[index + 3] = ToHalfFloat(lod);
                    index += 4;
                }
            }
            return destArray;
        }
        return new Uint16Array(arrayBuffer, dataOffset, dataLength);
    }
    static _GetFloatRGBAArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, lod) {
        if (DDSTools.StoreLODInAlphaChannel) {
            const destArray = new Float32Array(dataLength);
            const srcData = new Float32Array(arrayBuffer, dataOffset);
            let index = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcPos = (x + y * width) * 4;
                    destArray[index] = srcData[srcPos];
                    destArray[index + 1] = srcData[srcPos + 1];
                    destArray[index + 2] = srcData[srcPos + 2];
                    destArray[index + 3] = lod;
                    index += 4;
                }
            }
            return destArray;
        }
        return new Float32Array(arrayBuffer, dataOffset, dataLength);
    }
    static _GetFloatAsHalfFloatRGBAArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, lod) {
        const destArray = new Uint16Array(dataLength);
        const srcData = new Float32Array(arrayBuffer, dataOffset);
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                destArray[index] = ToHalfFloat(srcData[index]);
                destArray[index + 1] = ToHalfFloat(srcData[index + 1]);
                destArray[index + 2] = ToHalfFloat(srcData[index + 2]);
                if (DDSTools.StoreLODInAlphaChannel) {
                    destArray[index + 3] = ToHalfFloat(lod);
                }
                else {
                    destArray[index + 3] = ToHalfFloat(srcData[index + 3]);
                }
                index += 4;
            }
        }
        return destArray;
    }
    static _GetFloatAsUIntRGBAArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, lod) {
        const destArray = new Uint8Array(dataLength);
        const srcData = new Float32Array(arrayBuffer, dataOffset);
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcPos = (x + y * width) * 4;
                destArray[index] = Scalar.Clamp(srcData[srcPos]) * 255;
                destArray[index + 1] = Scalar.Clamp(srcData[srcPos + 1]) * 255;
                destArray[index + 2] = Scalar.Clamp(srcData[srcPos + 2]) * 255;
                if (DDSTools.StoreLODInAlphaChannel) {
                    destArray[index + 3] = lod;
                }
                else {
                    destArray[index + 3] = Scalar.Clamp(srcData[srcPos + 3]) * 255;
                }
                index += 4;
            }
        }
        return destArray;
    }
    static _GetHalfFloatAsUIntRGBAArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, lod) {
        const destArray = new Uint8Array(dataLength);
        const srcData = new Uint16Array(arrayBuffer, dataOffset);
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcPos = (x + y * width) * 4;
                destArray[index] = Scalar.Clamp(FromHalfFloat(srcData[srcPos])) * 255;
                destArray[index + 1] = Scalar.Clamp(FromHalfFloat(srcData[srcPos + 1])) * 255;
                destArray[index + 2] = Scalar.Clamp(FromHalfFloat(srcData[srcPos + 2])) * 255;
                if (DDSTools.StoreLODInAlphaChannel) {
                    destArray[index + 3] = lod;
                }
                else {
                    destArray[index + 3] = Scalar.Clamp(FromHalfFloat(srcData[srcPos + 3])) * 255;
                }
                index += 4;
            }
        }
        return destArray;
    }
    static _GetRGBAArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, rOffset, gOffset, bOffset, aOffset) {
        const byteArray = new Uint8Array(dataLength);
        const srcData = new Uint8Array(arrayBuffer, dataOffset);
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcPos = (x + y * width) * 4;
                byteArray[index] = srcData[srcPos + rOffset];
                byteArray[index + 1] = srcData[srcPos + gOffset];
                byteArray[index + 2] = srcData[srcPos + bOffset];
                byteArray[index + 3] = srcData[srcPos + aOffset];
                index += 4;
            }
        }
        return byteArray;
    }
    static _ExtractLongWordOrder(value) {
        if (value === 0 || value === 255 || value === -16777216) {
            return 0;
        }
        return 1 + DDSTools._ExtractLongWordOrder(value >> 8);
    }
    static _GetRGBArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer, rOffset, gOffset, bOffset) {
        const byteArray = new Uint8Array(dataLength);
        const srcData = new Uint8Array(arrayBuffer, dataOffset);
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcPos = (x + y * width) * 3;
                byteArray[index] = srcData[srcPos + rOffset];
                byteArray[index + 1] = srcData[srcPos + gOffset];
                byteArray[index + 2] = srcData[srcPos + bOffset];
                index += 3;
            }
        }
        return byteArray;
    }
    static _GetLuminanceArrayBuffer(width, height, dataOffset, dataLength, arrayBuffer) {
        const byteArray = new Uint8Array(dataLength);
        const srcData = new Uint8Array(arrayBuffer, dataOffset);
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcPos = x + y * width;
                byteArray[index] = srcData[srcPos];
                index++;
            }
        }
        return byteArray;
    }
    /**
     * Uploads DDS Levels to a Babylon Texture
     * @internal
     */
    static UploadDDSLevels(engine, texture, data, info, loadMipmaps, faces, lodIndex = -1, currentFace, destTypeMustBeFilterable = true) {
        let sphericalPolynomialFaces = null;
        if (info.sphericalPolynomial) {
            sphericalPolynomialFaces = [];
        }
        const ext = !!engine.getCaps().s3tc;
        // TODO WEBGPU Once generateMipMaps is split into generateMipMaps + hasMipMaps in InternalTexture this line can be removed
        texture.generateMipMaps = loadMipmaps;
        const header = new Int32Array(data.buffer, data.byteOffset, headerLengthInt);
        let fourCC, width, height, dataLength = 0, dataOffset;
        let byteArray, mipmapCount, mip;
        let internalCompressedFormat = 0;
        let blockBytes = 1;
        if (header[off_magic] !== DDS_MAGIC) {
            Logger.Error("Invalid magic number in DDS header");
            return;
        }
        if (!info.isFourCC && !info.isRGB && !info.isLuminance) {
            Logger.Error("Unsupported format, must contain a FourCC, RGB or LUMINANCE code");
            return;
        }
        if (info.isCompressed && !ext) {
            Logger.Error("Compressed textures are not supported on this platform.");
            return;
        }
        let bpp = header[off_RGBbpp];
        dataOffset = header[off_size] + 4;
        let computeFormats = false;
        if (info.isFourCC) {
            fourCC = header[off_pfFourCC];
            switch (fourCC) {
                case FOURCC_DXT1:
                    blockBytes = 8;
                    internalCompressedFormat = 33777;
                    break;
                case FOURCC_DXT3:
                    blockBytes = 16;
                    internalCompressedFormat = 33778;
                    break;
                case FOURCC_DXT5:
                    blockBytes = 16;
                    internalCompressedFormat = 33779;
                    break;
                case FOURCC_D3DFMT_R16G16B16A16F:
                    computeFormats = true;
                    bpp = 64;
                    break;
                case FOURCC_D3DFMT_R32G32B32A32F:
                    computeFormats = true;
                    bpp = 128;
                    break;
                case FOURCC_DX10: {
                    // There is an additionnal header so dataOffset need to be changed
                    dataOffset += 5 * 4; // 5 uints
                    let supported = false;
                    switch (info.dxgiFormat) {
                        case DXGI_FORMAT_R16G16B16A16_FLOAT:
                            computeFormats = true;
                            bpp = 64;
                            supported = true;
                            break;
                        case DXGI_FORMAT_R32G32B32A32_FLOAT:
                            computeFormats = true;
                            bpp = 128;
                            supported = true;
                            break;
                        case DXGI_FORMAT_B8G8R8X8_UNORM:
                            info.isRGB = true;
                            info.isFourCC = false;
                            bpp = 32;
                            supported = true;
                            break;
                    }
                    if (supported) {
                        break;
                    }
                }
                // eslint-disable-next-line no-fallthrough
                default:
                    Logger.Error(["Unsupported FourCC code:", Int32ToFourCC(fourCC)]);
                    return;
            }
        }
        const rOffset = DDSTools._ExtractLongWordOrder(header[off_RMask]);
        const gOffset = DDSTools._ExtractLongWordOrder(header[off_GMask]);
        const bOffset = DDSTools._ExtractLongWordOrder(header[off_BMask]);
        const aOffset = DDSTools._ExtractLongWordOrder(header[off_AMask]);
        if (computeFormats) {
            internalCompressedFormat = engine._getRGBABufferInternalSizedFormat(info.textureType);
        }
        mipmapCount = 1;
        if (header[off_flags] & DDSD_MIPMAPCOUNT && loadMipmaps !== false) {
            mipmapCount = Math.max(1, header[off_mipmapCount]);
        }
        const startFace = currentFace || 0;
        const caps = engine.getCaps();
        for (let face = startFace; face < faces; face++) {
            width = header[off_width];
            height = header[off_height];
            for (mip = 0; mip < mipmapCount; ++mip) {
                if (lodIndex === -1 || lodIndex === mip) {
                    // In case of fixed LOD, if the lod has just been uploaded, early exit.
                    const i = lodIndex === -1 ? mip : 0;
                    if (!info.isCompressed && info.isFourCC) {
                        texture.format = 5;
                        dataLength = width * height * 4;
                        let floatArray = null;
                        if (engine._badOS || engine._badDesktopOS || (!caps.textureHalfFloat && !caps.textureFloat)) {
                            // Required because iOS has many issues with float and half float generation
                            if (bpp === 128) {
                                floatArray = DDSTools._GetFloatAsUIntRGBAArrayBuffer(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, i);
                                if (sphericalPolynomialFaces && i == 0) {
                                    sphericalPolynomialFaces.push(DDSTools._GetFloatRGBAArrayBuffer(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, i));
                                }
                            }
                            else if (bpp === 64) {
                                floatArray = DDSTools._GetHalfFloatAsUIntRGBAArrayBuffer(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, i);
                                if (sphericalPolynomialFaces && i == 0) {
                                    sphericalPolynomialFaces.push(DDSTools._GetHalfFloatAsFloatRGBAArrayBuffer(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, i));
                                }
                            }
                            texture.type = 0;
                        }
                        else {
                            const floatAvailable = caps.textureFloat && ((destTypeMustBeFilterable && caps.textureFloatLinearFiltering) || !destTypeMustBeFilterable);
                            const halfFloatAvailable = caps.textureHalfFloat && ((destTypeMustBeFilterable && caps.textureHalfFloatLinearFiltering) || !destTypeMustBeFilterable);
                            const destType = (bpp === 128 || (bpp === 64 && !halfFloatAvailable)) && floatAvailable
                                ? 1
                                : (bpp === 64 || (bpp === 128 && !floatAvailable)) && halfFloatAvailable
                                    ? 2
                                    : 0;
                            let dataGetter;
                            let dataGetterPolynomial = null;
                            switch (bpp) {
                                case 128: {
                                    switch (destType) {
                                        case 1:
                                            dataGetter = DDSTools._GetFloatRGBAArrayBuffer;
                                            dataGetterPolynomial = null;
                                            break;
                                        case 2:
                                            dataGetter = DDSTools._GetFloatAsHalfFloatRGBAArrayBuffer;
                                            dataGetterPolynomial = DDSTools._GetFloatRGBAArrayBuffer;
                                            break;
                                        case 0:
                                            dataGetter = DDSTools._GetFloatAsUIntRGBAArrayBuffer;
                                            dataGetterPolynomial = DDSTools._GetFloatRGBAArrayBuffer;
                                            break;
                                    }
                                    break;
                                }
                                default: {
                                    // 64 bpp
                                    switch (destType) {
                                        case 1:
                                            dataGetter = DDSTools._GetHalfFloatAsFloatRGBAArrayBuffer;
                                            dataGetterPolynomial = null;
                                            break;
                                        case 2:
                                            dataGetter = DDSTools._GetHalfFloatRGBAArrayBuffer;
                                            dataGetterPolynomial = DDSTools._GetHalfFloatAsFloatRGBAArrayBuffer;
                                            break;
                                        case 0:
                                            dataGetter = DDSTools._GetHalfFloatAsUIntRGBAArrayBuffer;
                                            dataGetterPolynomial = DDSTools._GetHalfFloatAsFloatRGBAArrayBuffer;
                                            break;
                                    }
                                    break;
                                }
                            }
                            texture.type = destType;
                            floatArray = dataGetter(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, i);
                            if (sphericalPolynomialFaces && i == 0) {
                                sphericalPolynomialFaces.push(dataGetterPolynomial ? dataGetterPolynomial(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, i) : floatArray);
                            }
                        }
                        if (floatArray) {
                            engine._uploadDataToTextureDirectly(texture, floatArray, face, i);
                        }
                    }
                    else if (info.isRGB) {
                        texture.type = 0;
                        if (bpp === 24) {
                            texture.format = 4;
                            dataLength = width * height * 3;
                            byteArray = DDSTools._GetRGBArrayBuffer(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, rOffset, gOffset, bOffset);
                            engine._uploadDataToTextureDirectly(texture, byteArray, face, i);
                        }
                        else {
                            // 32
                            texture.format = 5;
                            dataLength = width * height * 4;
                            byteArray = DDSTools._GetRGBAArrayBuffer(width, height, data.byteOffset + dataOffset, dataLength, data.buffer, rOffset, gOffset, bOffset, aOffset);
                            engine._uploadDataToTextureDirectly(texture, byteArray, face, i);
                        }
                    }
                    else if (info.isLuminance) {
                        const unpackAlignment = engine._getUnpackAlignement();
                        const unpaddedRowSize = width;
                        const paddedRowSize = Math.floor((width + unpackAlignment - 1) / unpackAlignment) * unpackAlignment;
                        dataLength = paddedRowSize * (height - 1) + unpaddedRowSize;
                        byteArray = DDSTools._GetLuminanceArrayBuffer(width, height, data.byteOffset + dataOffset, dataLength, data.buffer);
                        texture.format = 1;
                        texture.type = 0;
                        engine._uploadDataToTextureDirectly(texture, byteArray, face, i);
                    }
                    else {
                        dataLength = (((Math.max(4, width) / 4) * Math.max(4, height)) / 4) * blockBytes;
                        byteArray = new Uint8Array(data.buffer, data.byteOffset + dataOffset, dataLength);
                        texture.type = 0;
                        engine._uploadCompressedDataToTextureDirectly(texture, internalCompressedFormat, width, height, byteArray, face, i);
                    }
                }
                dataOffset += bpp ? width * height * (bpp / 8) : dataLength;
                width *= 0.5;
                height *= 0.5;
                width = Math.max(1.0, width);
                height = Math.max(1.0, height);
            }
            if (currentFace !== undefined) {
                // Loading a single face
                break;
            }
        }
        if (sphericalPolynomialFaces && sphericalPolynomialFaces.length > 0) {
            info.sphericalPolynomial = CubeMapToSphericalPolynomialTools.ConvertCubeMapToSphericalPolynomial({
                size: header[off_width],
                right: sphericalPolynomialFaces[0],
                left: sphericalPolynomialFaces[1],
                up: sphericalPolynomialFaces[2],
                down: sphericalPolynomialFaces[3],
                front: sphericalPolynomialFaces[4],
                back: sphericalPolynomialFaces[5],
                format: 5,
                type: 1,
                gammaSpace: false,
            });
        }
        else {
            info.sphericalPolynomial = undefined;
        }
    }
}
/**
 * Gets or sets a boolean indicating that LOD info is stored in alpha channel (false by default)
 */
DDSTools.StoreLODInAlphaChannel = false;
/**
 * Create a cube texture from prefiltered data (ie. the mipmaps contain ready to use data for PBR reflection)
 * @param rootUrl defines the url where the file to load is located
 * @param scene defines the current scene
 * @param lodScale defines scale to apply to the mip map selection
 * @param lodOffset defines offset to apply to the mip map selection
 * @param onLoad defines an optional callback raised when the texture is loaded
 * @param onError defines an optional callback raised if there is an issue to load the texture
 * @param format defines the format of the data
 * @param forcedExtension defines the extension to use to pick the right loader
 * @param createPolynomials defines wheter or not to create polynomails harmonics for the texture
 * @returns the cube texture as an InternalTexture
 */
ThinEngine.prototype.createPrefilteredCubeTexture = function (rootUrl, scene, lodScale, lodOffset, onLoad = null, onError = null, format, forcedExtension = null, createPolynomials = true) {
    const callback = (loadData) => {
        if (!loadData) {
            if (onLoad) {
                onLoad(null);
            }
            return;
        }
        const texture = loadData.texture;
        if (!createPolynomials) {
            texture._sphericalPolynomial = new SphericalPolynomial();
        }
        else if (loadData.info.sphericalPolynomial) {
            texture._sphericalPolynomial = loadData.info.sphericalPolynomial;
        }
        texture._source = InternalTextureSource.CubePrefiltered;
        if (this.getCaps().textureLOD) {
            // Do not add extra process if texture lod is supported.
            if (onLoad) {
                onLoad(texture);
            }
            return;
        }
        const mipSlices = 3;
        const gl = this._gl;
        const width = loadData.width;
        if (!width) {
            return;
        }
        const textures = [];
        for (let i = 0; i < mipSlices; i++) {
            //compute LOD from even spacing in smoothness (matching shader calculation)
            const smoothness = i / (mipSlices - 1);
            const roughness = 1 - smoothness;
            const minLODIndex = lodOffset; // roughness = 0
            const maxLODIndex = Scalar.Log2(width) * lodScale + lodOffset; // roughness = 1
            const lodIndex = minLODIndex + (maxLODIndex - minLODIndex) * roughness;
            const mipmapIndex = Math.round(Math.min(Math.max(lodIndex, 0), maxLODIndex));
            const glTextureFromLod = new InternalTexture(this, InternalTextureSource.Temp);
            glTextureFromLod.type = texture.type;
            glTextureFromLod.format = texture.format;
            glTextureFromLod.width = Math.pow(2, Math.max(Scalar.Log2(width) - mipmapIndex, 0));
            glTextureFromLod.height = glTextureFromLod.width;
            glTextureFromLod.isCube = true;
            glTextureFromLod._cachedWrapU = 0;
            glTextureFromLod._cachedWrapV = 0;
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, glTextureFromLod, true);
            glTextureFromLod.samplingMode = 2;
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            if (loadData.isDDS) {
                const info = loadData.info;
                const data = loadData.data;
                this._unpackFlipY(info.isCompressed);
                DDSTools.UploadDDSLevels(this, glTextureFromLod, data, info, true, 6, mipmapIndex);
            }
            else {
                Logger.Warn("DDS is the only prefiltered cube map supported so far.");
            }
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
            // Wrap in a base texture for easy binding.
            const lodTexture = new BaseTexture(scene);
            lodTexture._isCube = true;
            lodTexture._texture = glTextureFromLod;
            glTextureFromLod.isReady = true;
            textures.push(lodTexture);
        }
        texture._lodTextureHigh = textures[2];
        texture._lodTextureMid = textures[1];
        texture._lodTextureLow = textures[0];
        if (onLoad) {
            onLoad(texture);
        }
    };
    return this.createCubeTexture(rootUrl, scene, null, false, callback, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset);
};
//# sourceMappingURL=dds.js.map