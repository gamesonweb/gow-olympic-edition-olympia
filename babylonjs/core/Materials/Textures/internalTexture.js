import { Observable } from "../../Misc/observable.js";
import { TextureSampler } from "./textureSampler.js";
/**
 * Defines the source of the internal texture
 */
export var InternalTextureSource;
(function (InternalTextureSource) {
    /**
     * The source of the texture data is unknown
     */
    InternalTextureSource[InternalTextureSource["Unknown"] = 0] = "Unknown";
    /**
     * Texture data comes from an URL
     */
    InternalTextureSource[InternalTextureSource["Url"] = 1] = "Url";
    /**
     * Texture data is only used for temporary storage
     */
    InternalTextureSource[InternalTextureSource["Temp"] = 2] = "Temp";
    /**
     * Texture data comes from raw data (ArrayBuffer)
     */
    InternalTextureSource[InternalTextureSource["Raw"] = 3] = "Raw";
    /**
     * Texture content is dynamic (video or dynamic texture)
     */
    InternalTextureSource[InternalTextureSource["Dynamic"] = 4] = "Dynamic";
    /**
     * Texture content is generated by rendering to it
     */
    InternalTextureSource[InternalTextureSource["RenderTarget"] = 5] = "RenderTarget";
    /**
     * Texture content is part of a multi render target process
     */
    InternalTextureSource[InternalTextureSource["MultiRenderTarget"] = 6] = "MultiRenderTarget";
    /**
     * Texture data comes from a cube data file
     */
    InternalTextureSource[InternalTextureSource["Cube"] = 7] = "Cube";
    /**
     * Texture data comes from a raw cube data
     */
    InternalTextureSource[InternalTextureSource["CubeRaw"] = 8] = "CubeRaw";
    /**
     * Texture data come from a prefiltered cube data file
     */
    InternalTextureSource[InternalTextureSource["CubePrefiltered"] = 9] = "CubePrefiltered";
    /**
     * Texture content is raw 3D data
     */
    InternalTextureSource[InternalTextureSource["Raw3D"] = 10] = "Raw3D";
    /**
     * Texture content is raw 2D array data
     */
    InternalTextureSource[InternalTextureSource["Raw2DArray"] = 11] = "Raw2DArray";
    /**
     * Texture content is a depth/stencil texture
     */
    InternalTextureSource[InternalTextureSource["DepthStencil"] = 12] = "DepthStencil";
    /**
     * Texture data comes from a raw cube data encoded with RGBD
     */
    InternalTextureSource[InternalTextureSource["CubeRawRGBD"] = 13] = "CubeRawRGBD";
    /**
     * Texture content is a depth texture
     */
    InternalTextureSource[InternalTextureSource["Depth"] = 14] = "Depth";
})(InternalTextureSource || (InternalTextureSource = {}));
/**
 * Class used to store data associated with WebGL texture data for the engine
 * This class should not be used directly
 */
export class InternalTexture extends TextureSampler {
    /**
     * Gets a boolean indicating if the texture uses mipmaps
     * TODO implements useMipMaps as a separate setting from generateMipMaps
     */
    get useMipMaps() {
        return this.generateMipMaps;
    }
    set useMipMaps(value) {
        this.generateMipMaps = value;
    }
    /** Gets the unique id of the internal texture */
    get uniqueId() {
        return this._uniqueId;
    }
    /** @internal */
    _setUniqueId(id) {
        this._uniqueId = id;
    }
    /**
     * Gets the Engine the texture belongs to.
     * @returns The babylon engine
     */
    getEngine() {
        return this._engine;
    }
    /**
     * Gets the data source type of the texture
     */
    get source() {
        return this._source;
    }
    /**
     * Creates a new InternalTexture
     * @param engine defines the engine to use
     * @param source defines the type of data that will be used
     * @param delayAllocation if the texture allocation should be delayed (default: false)
     */
    constructor(engine, source, delayAllocation = false) {
        super();
        /**
         * Defines if the texture is ready
         */
        this.isReady = false;
        /**
         * Defines if the texture is a cube texture
         */
        this.isCube = false;
        /**
         * Defines if the texture contains 3D data
         */
        this.is3D = false;
        /**
         * Defines if the texture contains 2D array data
         */
        this.is2DArray = false;
        /**
         * Defines if the texture contains multiview data
         */
        this.isMultiview = false;
        /**
         * Gets the URL used to load this texture
         */
        this.url = "";
        /**
         * Gets a boolean indicating if the texture needs mipmaps generation
         */
        this.generateMipMaps = false;
        /**
         * Gets the number of samples used by the texture (WebGL2+ only)
         */
        this.samples = 0;
        /**
         * Gets the type of the texture (int, float...)
         */
        this.type = -1;
        /**
         * Gets the format of the texture (RGB, RGBA...)
         */
        this.format = -1;
        /**
         * Observable called when the texture is loaded
         */
        this.onLoadedObservable = new Observable();
        /**
         * Observable called when the texture load is raising an error
         */
        this.onErrorObservable = new Observable();
        /**
         * If this callback is defined it will be called instead of the default _rebuild function
         */
        this.onRebuildCallback = null;
        /**
         * Gets the width of the texture
         */
        this.width = 0;
        /**
         * Gets the height of the texture
         */
        this.height = 0;
        /**
         * Gets the depth of the texture
         */
        this.depth = 0;
        /**
         * Gets the initial width of the texture (It could be rescaled if the current system does not support non power of two textures)
         */
        this.baseWidth = 0;
        /**
         * Gets the initial height of the texture (It could be rescaled if the current system does not support non power of two textures)
         */
        this.baseHeight = 0;
        /**
         * Gets the initial depth of the texture (It could be rescaled if the current system does not support non power of two textures)
         */
        this.baseDepth = 0;
        /**
         * Gets a boolean indicating if the texture is inverted on Y axis
         */
        this.invertY = false;
        // Private
        /** @internal */
        this._invertVScale = false;
        /** @internal */
        this._associatedChannel = -1;
        /** @internal */
        this._source = InternalTextureSource.Unknown;
        /** @internal */
        this._buffer = null;
        /** @internal */
        this._bufferView = null;
        /** @internal */
        this._bufferViewArray = null;
        /** @internal */
        this._bufferViewArrayArray = null;
        /** @internal */
        this._size = 0;
        /** @internal */
        this._extension = "";
        /** @internal */
        this._files = null;
        /** @internal */
        this._workingCanvas = null;
        /** @internal */
        this._workingContext = null;
        /** @internal */
        this._cachedCoordinatesMode = null;
        /** @internal */
        this._isDisabled = false;
        /** @internal */
        this._compression = null;
        /** @internal */
        this._sphericalPolynomial = null;
        /** @internal */
        this._sphericalPolynomialPromise = null;
        /** @internal */
        this._sphericalPolynomialComputed = false;
        /** @internal */
        this._lodGenerationScale = 0;
        /** @internal */
        this._lodGenerationOffset = 0;
        /** @internal */
        this._useSRGBBuffer = false;
        /** @internal */
        this._creationFlags = 0;
        // The following three fields helps sharing generated fixed LODs for texture filtering
        // In environment not supporting the textureLOD extension like EDGE. They are for internal use only.
        // They are at the level of the gl texture to benefit from the cache.
        /** @internal */
        this._lodTextureHigh = null;
        /** @internal */
        this._lodTextureMid = null;
        /** @internal */
        this._lodTextureLow = null;
        /** @internal */
        this._isRGBD = false;
        /** @internal */
        this._linearSpecularLOD = false;
        /** @internal */
        this._irradianceTexture = null;
        /** @internal */
        this._hardwareTexture = null;
        /** @internal */
        this._maxLodLevel = null;
        /** @internal */
        this._references = 1;
        /** @internal */
        this._gammaSpace = null;
        /** @internal */
        this._premulAlpha = false;
        /** @internal */
        this._dynamicTextureSource = null;
        this._engine = engine;
        this._source = source;
        this._uniqueId = InternalTexture._Counter++;
        if (!delayAllocation) {
            this._hardwareTexture = engine._createHardwareTexture();
        }
    }
    /**
     * Increments the number of references (ie. the number of Texture that point to it)
     */
    incrementReferences() {
        this._references++;
    }
    /**
     * Change the size of the texture (not the size of the content)
     * @param width defines the new width
     * @param height defines the new height
     * @param depth defines the new depth (1 by default)
     */
    updateSize(width, height, depth = 1) {
        this._engine.updateTextureDimensions(this, width, height, depth);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.baseWidth = width;
        this.baseHeight = height;
        this.baseDepth = depth;
        this._size = width * height * depth;
    }
    /** @internal */
    _rebuild() {
        this.isReady = false;
        this._cachedCoordinatesMode = null;
        this._cachedWrapU = null;
        this._cachedWrapV = null;
        this._cachedWrapR = null;
        this._cachedAnisotropicFilteringLevel = null;
        if (this.onRebuildCallback) {
            const data = this.onRebuildCallback(this);
            const swapAndSetIsReady = (proxyInternalTexture) => {
                proxyInternalTexture._swapAndDie(this, false);
                this.isReady = data.isReady;
            };
            if (data.isAsync) {
                data.proxy.then(swapAndSetIsReady);
            }
            else {
                swapAndSetIsReady(data.proxy);
            }
            return;
        }
        let proxy;
        switch (this.source) {
            case InternalTextureSource.Temp:
                break;
            case InternalTextureSource.Url:
                proxy = this._engine.createTexture(this._originalUrl ?? this.url, !this.generateMipMaps, this.invertY, null, this.samplingMode, 
                // Do not use Proxy here as it could be fully synchronous
                // and proxy would be undefined.
                (temp) => {
                    temp._swapAndDie(this, false);
                    this.isReady = true;
                }, null, this._buffer, undefined, this.format, this._extension, undefined, undefined, undefined, this._useSRGBBuffer);
                return;
            case InternalTextureSource.Raw:
                proxy = this._engine.createRawTexture(this._bufferView, this.baseWidth, this.baseHeight, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression, this.type, this._creationFlags, this._useSRGBBuffer);
                proxy._swapAndDie(this, false);
                this.isReady = true;
                break;
            case InternalTextureSource.Raw3D:
                proxy = this._engine.createRawTexture3D(this._bufferView, this.baseWidth, this.baseHeight, this.baseDepth, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression, this.type);
                proxy._swapAndDie(this, false);
                this.isReady = true;
                break;
            case InternalTextureSource.Raw2DArray:
                proxy = this._engine.createRawTexture2DArray(this._bufferView, this.baseWidth, this.baseHeight, this.baseDepth, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression, this.type);
                proxy._swapAndDie(this, false);
                this.isReady = true;
                break;
            case InternalTextureSource.Dynamic:
                proxy = this._engine.createDynamicTexture(this.baseWidth, this.baseHeight, this.generateMipMaps, this.samplingMode);
                proxy._swapAndDie(this, false);
                if (this._dynamicTextureSource) {
                    this._engine.updateDynamicTexture(this, this._dynamicTextureSource, this.invertY, this._premulAlpha, this.format, true);
                }
                // The engine will make sure to update content so no need to flag it as isReady = true
                break;
            case InternalTextureSource.Cube:
                proxy = this._engine.createCubeTexture(this.url, null, this._files, !this.generateMipMaps, () => {
                    proxy._swapAndDie(this, false);
                    this.isReady = true;
                }, null, this.format, this._extension, false, 0, 0, null, undefined, this._useSRGBBuffer);
                return;
            case InternalTextureSource.CubeRaw:
                proxy = this._engine.createRawCubeTexture(this._bufferViewArray, this.width, this._originalFormat ?? this.format, this.type, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                proxy._swapAndDie(this, false);
                this.isReady = true;
                break;
            case InternalTextureSource.CubeRawRGBD:
                // This case is being handeled by the environment texture tools and is not a part of the rebuild process.
                // To use CubeRawRGBD use updateRGBDAsync on the cube texture.
                return;
            case InternalTextureSource.CubePrefiltered:
                proxy = this._engine.createPrefilteredCubeTexture(this.url, null, this._lodGenerationScale, this._lodGenerationOffset, (proxy) => {
                    if (proxy) {
                        proxy._swapAndDie(this, false);
                    }
                    this.isReady = true;
                }, null, this.format, this._extension);
                proxy._sphericalPolynomial = this._sphericalPolynomial;
                return;
            case InternalTextureSource.DepthStencil:
            case InternalTextureSource.Depth: {
                // Will be handled at the RenderTargetWrapper level
                break;
            }
        }
    }
    /**
     * @internal
     */
    _swapAndDie(target, swapAll = true) {
        // TODO what about refcount on target?
        this._hardwareTexture?.setUsage(target._source, this.generateMipMaps, this.is2DArray, this.isCube, this.is3D, this.width, this.height, this.depth);
        target._hardwareTexture = this._hardwareTexture;
        if (swapAll) {
            target._isRGBD = this._isRGBD;
        }
        if (this._lodTextureHigh) {
            if (target._lodTextureHigh) {
                target._lodTextureHigh.dispose();
            }
            target._lodTextureHigh = this._lodTextureHigh;
        }
        if (this._lodTextureMid) {
            if (target._lodTextureMid) {
                target._lodTextureMid.dispose();
            }
            target._lodTextureMid = this._lodTextureMid;
        }
        if (this._lodTextureLow) {
            if (target._lodTextureLow) {
                target._lodTextureLow.dispose();
            }
            target._lodTextureLow = this._lodTextureLow;
        }
        if (this._irradianceTexture) {
            if (target._irradianceTexture) {
                target._irradianceTexture.dispose();
            }
            target._irradianceTexture = this._irradianceTexture;
        }
        const cache = this._engine.getLoadedTexturesCache();
        let index = cache.indexOf(this);
        if (index !== -1) {
            cache.splice(index, 1);
        }
        index = cache.indexOf(target);
        if (index === -1) {
            cache.push(target);
        }
    }
    /**
     * Dispose the current allocated resources
     */
    dispose() {
        this._references--;
        this.onLoadedObservable.clear();
        this.onErrorObservable.clear();
        if (this._references === 0) {
            this._engine._releaseTexture(this);
            this._hardwareTexture = null;
            this._dynamicTextureSource = null;
        }
    }
}
/** @internal */
InternalTexture._Counter = 0;
//# sourceMappingURL=internalTexture.js.map