import { InternalTexture, InternalTextureSource } from "../../Materials/Textures/internalTexture.js";
import { Logger } from "../../Misc/logger.js";

import { ThinEngine } from "../thinEngine.js";
ThinEngine.prototype.restoreSingleAttachment = function () {
    const gl = this._gl;
    this.bindAttachments([gl.BACK]);
};
ThinEngine.prototype.restoreSingleAttachmentForRenderTarget = function () {
    const gl = this._gl;
    this.bindAttachments([gl.COLOR_ATTACHMENT0]);
};
ThinEngine.prototype.buildTextureLayout = function (textureStatus) {
    const gl = this._gl;
    const result = [];
    for (let i = 0; i < textureStatus.length; i++) {
        if (textureStatus[i]) {
            result.push(gl["COLOR_ATTACHMENT" + i]);
        }
        else {
            result.push(gl.NONE);
        }
    }
    return result;
};
ThinEngine.prototype.bindAttachments = function (attachments) {
    const gl = this._gl;
    gl.drawBuffers(attachments);
};
ThinEngine.prototype.unBindMultiColorAttachmentFramebuffer = function (rtWrapper, disableGenerateMipMaps = false, onBeforeUnbind) {
    this._currentRenderTarget = null;
    // If MSAA, we need to bitblt back to main texture
    const gl = this._gl;
    const attachments = rtWrapper._attachments;
    const count = attachments.length;
    if (rtWrapper._MSAAFramebuffer) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, rtWrapper._MSAAFramebuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, rtWrapper._framebuffer);
        for (let i = 0; i < count; i++) {
            const texture = rtWrapper.textures[i];
            for (let j = 0; j < count; j++) {
                attachments[j] = gl.NONE;
            }
            attachments[i] = gl[this.webGLVersion > 1 ? "COLOR_ATTACHMENT" + i : "COLOR_ATTACHMENT" + i + "_WEBGL"];
            gl.readBuffer(attachments[i]);
            gl.drawBuffers(attachments);
            gl.blitFramebuffer(0, 0, texture.width, texture.height, 0, 0, texture.width, texture.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        }
        for (let i = 0; i < count; i++) {
            attachments[i] = gl[this.webGLVersion > 1 ? "COLOR_ATTACHMENT" + i : "COLOR_ATTACHMENT" + i + "_WEBGL"];
        }
        gl.drawBuffers(attachments);
    }
    for (let i = 0; i < count; i++) {
        const texture = rtWrapper.textures[i];
        if (texture?.generateMipMaps && !disableGenerateMipMaps && !texture?.isCube && !texture?.is3D) {
            this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
            gl.generateMipmap(gl.TEXTURE_2D);
            this._bindTextureDirectly(gl.TEXTURE_2D, null);
        }
    }
    if (onBeforeUnbind) {
        if (rtWrapper._MSAAFramebuffer) {
            // Bind the correct framebuffer
            this._bindUnboundFramebuffer(rtWrapper._framebuffer);
        }
        onBeforeUnbind();
    }
    this._bindUnboundFramebuffer(null);
};
ThinEngine.prototype.createMultipleRenderTarget = function (size, options, initializeBuffers = true) {
    let generateMipMaps = false;
    let generateDepthBuffer = true;
    let generateStencilBuffer = false;
    let generateDepthTexture = false;
    let depthTextureFormat = 15;
    let textureCount = 1;
    const defaultType = 0;
    const defaultSamplingMode = 3;
    const defaultUseSRGBBuffer = false;
    const defaultFormat = 5;
    const defaultTarget = 3553;
    let types = [];
    let samplingModes = [];
    let useSRGBBuffers = [];
    let formats = [];
    let targets = [];
    let faceIndex = [];
    let layerIndex = [];
    let layers = [];
    const rtWrapper = this._createHardwareRenderTargetWrapper(true, false, size);
    if (options !== undefined) {
        generateMipMaps = options.generateMipMaps === undefined ? false : options.generateMipMaps;
        generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
        generateStencilBuffer = options.generateStencilBuffer === undefined ? false : options.generateStencilBuffer;
        generateDepthTexture = options.generateDepthTexture === undefined ? false : options.generateDepthTexture;
        textureCount = options.textureCount || 1;
        if (options.types) {
            types = options.types;
        }
        if (options.samplingModes) {
            samplingModes = options.samplingModes;
        }
        if (options.useSRGBBuffers) {
            useSRGBBuffers = options.useSRGBBuffers;
        }
        if (options.formats) {
            formats = options.formats;
        }
        if (options.targetTypes) {
            targets = options.targetTypes;
        }
        if (options.faceIndex) {
            faceIndex = options.faceIndex;
        }
        if (options.layerIndex) {
            layerIndex = options.layerIndex;
        }
        if (options.layerCounts) {
            layers = options.layerCounts;
        }
        if (this.webGLVersion > 1 &&
            (options.depthTextureFormat === 13 ||
                options.depthTextureFormat === 17 ||
                options.depthTextureFormat === 16 ||
                options.depthTextureFormat === 14 ||
                options.depthTextureFormat === 18)) {
            depthTextureFormat = options.depthTextureFormat;
        }
    }
    rtWrapper.label = options?.label ?? "MultiRenderTargetWrapper";
    const gl = this._gl;
    // Create the framebuffer
    const framebuffer = gl.createFramebuffer();
    this._bindUnboundFramebuffer(framebuffer);
    const width = size.width || size;
    const height = size.height || size;
    const textures = [];
    const attachments = [];
    const useStencilTexture = this.webGLVersion > 1 &&
        generateDepthTexture &&
        (options.depthTextureFormat === 13 ||
            options.depthTextureFormat === 17 ||
            options.depthTextureFormat === 18);
    const depthStencilBuffer = this._setupFramebufferDepthAttachments(!useStencilTexture && generateStencilBuffer, !generateDepthTexture && generateDepthBuffer, width, height);
    rtWrapper._framebuffer = framebuffer;
    rtWrapper._depthStencilBuffer = depthStencilBuffer;
    rtWrapper._generateDepthBuffer = !generateDepthTexture && generateDepthBuffer;
    rtWrapper._generateStencilBuffer = !useStencilTexture && generateStencilBuffer;
    rtWrapper._attachments = attachments;
    for (let i = 0; i < textureCount; i++) {
        let samplingMode = samplingModes[i] || defaultSamplingMode;
        let type = types[i] || defaultType;
        let useSRGBBuffer = useSRGBBuffers[i] || defaultUseSRGBBuffer;
        const format = formats[i] || defaultFormat;
        const target = targets[i] || defaultTarget;
        const layerCount = layers[i] ?? 1;
        if (type === 1 && !this._caps.textureFloatLinearFiltering) {
            // if floating point linear (gl.FLOAT) then force to NEAREST_SAMPLINGMODE
            samplingMode = 1;
        }
        else if (type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
            // if floating point linear (HALF_FLOAT) then force to NEAREST_SAMPLINGMODE
            samplingMode = 1;
        }
        const filters = this._getSamplingParameters(samplingMode, generateMipMaps);
        if (type === 1 && !this._caps.textureFloat) {
            type = 0;
            Logger.Warn("Float textures are not supported. Render target forced to TEXTURETYPE_UNSIGNED_BYTE type");
        }
        useSRGBBuffer = useSRGBBuffer && this._caps.supportSRGBBuffers && (this.webGLVersion > 1 || this.isWebGPU);
        const isWebGL2 = this.webGLVersion > 1;
        const attachment = gl[isWebGL2 ? "COLOR_ATTACHMENT" + i : "COLOR_ATTACHMENT" + i + "_WEBGL"];
        attachments.push(attachment);
        if (target === -1) {
            continue;
        }
        const texture = new InternalTexture(this, InternalTextureSource.MultiRenderTarget);
        textures[i] = texture;
        gl.activeTexture(gl["TEXTURE" + i]);
        gl.bindTexture(target, texture._hardwareTexture.underlyingResource);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, filters.mag);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, filters.min);
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const internalSizedFormat = this._getRGBABufferInternalSizedFormat(type, format, useSRGBBuffer);
        const internalFormat = this._getInternalFormat(format);
        const webGLTextureType = this._getWebGLTextureType(type);
        if (isWebGL2 && (target === 35866 || target === 32879)) {
            if (target === 35866) {
                texture.is2DArray = true;
            }
            else {
                texture.is3D = true;
            }
            texture.baseDepth = texture.depth = layerCount;
            gl.texImage3D(target, 0, internalSizedFormat, width, height, layerCount, 0, internalFormat, webGLTextureType, null);
        }
        else if (target === 34067) {
            // We have to generate all faces to complete the framebuffer
            for (let i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalSizedFormat, width, height, 0, internalFormat, webGLTextureType, null);
            }
            texture.isCube = true;
        }
        else {
            gl.texImage2D(gl.TEXTURE_2D, 0, internalSizedFormat, width, height, 0, internalFormat, webGLTextureType, null);
        }
        if (generateMipMaps) {
            gl.generateMipmap(target);
        }
        // Unbind
        this._bindTextureDirectly(target, null);
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = width;
        texture.height = height;
        texture.isReady = true;
        texture.samples = 1;
        texture.generateMipMaps = generateMipMaps;
        texture.samplingMode = samplingMode;
        texture.type = type;
        texture._useSRGBBuffer = useSRGBBuffer;
        texture.format = format;
        this._internalTexturesCache.push(texture);
    }
    if (generateDepthTexture && this._caps.depthTextureExtension) {
        // Depth texture
        const depthTexture = new InternalTexture(this, InternalTextureSource.Depth);
        let depthTextureType = 5;
        let glDepthTextureInternalFormat = gl.DEPTH_COMPONENT16;
        let glDepthTextureFormat = gl.DEPTH_COMPONENT;
        let glDepthTextureType = gl.UNSIGNED_SHORT;
        let glDepthTextureAttachment = gl.DEPTH_ATTACHMENT;
        if (this.webGLVersion < 2) {
            glDepthTextureInternalFormat = gl.DEPTH_COMPONENT;
        }
        else {
            if (depthTextureFormat === 14) {
                depthTextureType = 1;
                glDepthTextureType = gl.FLOAT;
                glDepthTextureInternalFormat = gl.DEPTH_COMPONENT32F;
            }
            else if (depthTextureFormat === 18) {
                depthTextureType = 0;
                glDepthTextureType = gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
                glDepthTextureInternalFormat = gl.DEPTH32F_STENCIL8;
                glDepthTextureFormat = gl.DEPTH_STENCIL;
                glDepthTextureAttachment = gl.DEPTH_STENCIL_ATTACHMENT;
            }
            else if (depthTextureFormat === 16) {
                depthTextureType = 0;
                glDepthTextureType = gl.UNSIGNED_INT;
                glDepthTextureInternalFormat = gl.DEPTH_COMPONENT24;
                glDepthTextureAttachment = gl.DEPTH_ATTACHMENT;
            }
            else if (depthTextureFormat === 13 || depthTextureFormat === 17) {
                depthTextureType = 12;
                glDepthTextureType = gl.UNSIGNED_INT_24_8;
                glDepthTextureInternalFormat = gl.DEPTH24_STENCIL8;
                glDepthTextureFormat = gl.DEPTH_STENCIL;
                glDepthTextureAttachment = gl.DEPTH_STENCIL_ATTACHMENT;
            }
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, depthTexture._hardwareTexture.underlyingResource);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, glDepthTextureInternalFormat, width, height, 0, glDepthTextureFormat, glDepthTextureType, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, glDepthTextureAttachment, gl.TEXTURE_2D, depthTexture._hardwareTexture.underlyingResource, 0);
        depthTexture.baseWidth = width;
        depthTexture.baseHeight = height;
        depthTexture.width = width;
        depthTexture.height = height;
        depthTexture.isReady = true;
        depthTexture.samples = 1;
        depthTexture.generateMipMaps = generateMipMaps;
        depthTexture.samplingMode = 1;
        depthTexture.format = depthTextureFormat;
        depthTexture.type = depthTextureType;
        textures[textureCount] = depthTexture;
        this._internalTexturesCache.push(depthTexture);
    }
    rtWrapper.setTextures(textures);
    if (initializeBuffers) {
        gl.drawBuffers(attachments);
    }
    this._bindUnboundFramebuffer(null);
    rtWrapper.setLayerAndFaceIndices(layerIndex, faceIndex);
    this.resetTextureCache();
    return rtWrapper;
};
ThinEngine.prototype.updateMultipleRenderTargetTextureSampleCount = function (rtWrapper, samples, initializeBuffers = true) {
    if (this.webGLVersion < 2 || !rtWrapper || !rtWrapper.texture) {
        return 1;
    }
    if (rtWrapper.samples === samples) {
        return samples;
    }
    const count = rtWrapper._attachments.length;
    if (count === 0) {
        return 1;
    }
    const gl = this._gl;
    samples = Math.min(samples, this.getCaps().maxMSAASamples);
    // Dispose previous render buffers
    const useDepthStencil = !!rtWrapper._depthStencilBuffer;
    if (useDepthStencil) {
        gl.deleteRenderbuffer(rtWrapper._depthStencilBuffer);
        rtWrapper._depthStencilBuffer = null;
    }
    if (rtWrapper._MSAAFramebuffer) {
        gl.deleteFramebuffer(rtWrapper._MSAAFramebuffer);
        rtWrapper._MSAAFramebuffer = null;
    }
    if (samples > 1 && typeof gl.renderbufferStorageMultisample === "function") {
        const framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            throw new Error("Unable to create multi sampled framebuffer");
        }
        rtWrapper._MSAAFramebuffer = framebuffer;
        this._bindUnboundFramebuffer(framebuffer);
        const attachments = [];
        for (let i = 0; i < count; i++) {
            const texture = rtWrapper.textures[i];
            const hardwareTexture = texture._hardwareTexture;
            hardwareTexture.releaseMSAARenderBuffers();
        }
        for (let i = 0; i < count; i++) {
            const texture = rtWrapper.textures[i];
            const hardwareTexture = texture._hardwareTexture;
            const attachment = gl[this.webGLVersion > 1 ? "COLOR_ATTACHMENT" + i : "COLOR_ATTACHMENT" + i + "_WEBGL"];
            const colorRenderbuffer = this._createRenderBuffer(texture.width, texture.height, samples, -1 /* not used */, this._getRGBABufferInternalSizedFormat(texture.type, texture.format, texture._useSRGBBuffer), attachment);
            if (!colorRenderbuffer) {
                throw new Error("Unable to create multi sampled framebuffer");
            }
            hardwareTexture.addMSAARenderBuffer(colorRenderbuffer);
            texture.samples = samples;
            attachments.push(attachment);
        }
        if (initializeBuffers) {
            gl.drawBuffers(attachments);
        }
    }
    else {
        this._bindUnboundFramebuffer(rtWrapper._framebuffer);
    }
    if (useDepthStencil) {
        rtWrapper._depthStencilBuffer = this._setupFramebufferDepthAttachments(rtWrapper._generateStencilBuffer, rtWrapper._generateDepthBuffer, rtWrapper.texture.width, rtWrapper.texture.height, samples);
    }
    this._bindUnboundFramebuffer(null);
    return samples;
};
//# sourceMappingURL=engine.multiRender.js.map