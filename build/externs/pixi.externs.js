var PIXI = {
    Stage: {
        length: 1,
        prototype: {
            setInteractionDelegate: {
                length: 1,
                prototype: {}
            },
            updateTransform: {
                prototype: {}
            },
            setBackgroundColor: {
                length: 1,
                prototype: {}
            },
            getMousePosition: {
                prototype: {}
            }
        }
    },
    blendModes: {
        ADD: 1,
        MULTIPLY: 2,
        SCREEN: 3
    },
    Rope: {
        length: 2,
        prototype: {
            refresh: {
                prototype: {}
            },
            updateTransform: {
                prototype: {}
            },
            setTexture: {
                length: 1,
                prototype: {}
            }
        }
    },
    texturesToUpdate: [],
    hex2rgb: {
        length: 1,
        prototype: {}
    },
    EventTarget: {
        prototype: {}
    },
    InteractionManager: {
        length: 1,
        prototype: {
            collectInteractiveSprite: {
                length: 2,
                prototype: {}
            },
            setTarget: {
                length: 1,
                prototype: {}
            },
            setTargetDomElement: {
                length: 1,
                prototype: {}
            },
            update: {
                prototype: {}
            },
            onMouseMove: {
                length: 1,
                prototype: {}
            },
            onMouseDown: {
                length: 1,
                prototype: {}
            },
            onMouseOut: {
                prototype: {}
            },
            onMouseUp: {
                length: 1,
                prototype: {}
            },
            hitTest: {
                length: 2,
                prototype: {}
            },
            onTouchMove: {
                length: 1,
                prototype: {}
            },
            onTouchStart: {
                length: 1,
                prototype: {}
            },
            onTouchEnd: {
                length: 1,
                prototype: {}
            }
        }
    },
    WebGLSpriteBatch: {
        length: 1,
        prototype: {
            setContext: {
                length: 1,
                prototype: {}
            },
            begin: {
                length: 1,
                prototype: {}
            },
            end: {
                prototype: {}
            },
            render: {
                length: 1,
                prototype: {}
            },
            renderTilingSprite: {
                length: 1,
                prototype: {}
            },
            flush: {
                prototype: {}
            },
            stop: {
                prototype: {}
            },
            start: {
                prototype: {}
            },
            setBlendMode: {
                length: 1,
                prototype: {}
            }
        }
    },
    AtlasLoader: {
        length: 2,
        prototype: {
            load: {
                prototype: {}
            },
            onAtlasLoaded: {
                prototype: {}
            },
            onLoaded: {
                prototype: {}
            },
            onError: {
                prototype: {}
            }
        }
    },
    StripShader: {
        prototype: {
            init: {
                prototype: {}
            }
        }
    },
    WebGLMaskManager: {
        length: 1,
        prototype: {
            setContext: {
                length: 1,
                prototype: {}
            },
            pushMask: {
                length: 2,
                prototype: {}
            },
            popMask: {
                length: 1,
                prototype: {}
            }
        }
    },
    mat3: {
        create: {
            prototype: {}
        },
        identity: {
            length: 1,
            prototype: {}
        },
        multiply: {
            length: 3,
            prototype: {}
        },
        clone: {
            length: 1,
            prototype: {}
        },
        transpose: {
            length: 2,
            prototype: {}
        },
        toMat4: {
            length: 2,
            prototype: {}
        }
    },
    CompileFragmentShader: {
        length: 2,
        prototype: {}
    },
    createWebGLTexture: {
        length: 2,
        prototype: {}
    },
    CanvasBuffer: {
        length: 2,
        prototype: {
            clear: {
                prototype: {}
            },
            resize: {
                length: 2,
                prototype: {}
            }
        }
    },
    CanvasGraphics: {
        prototype: {},
        renderGraphics: {
            length: 2,
            prototype: {}
        },
        renderGraphicsMask: {
            length: 2,
            prototype: {}
        }
    },
    AjaxRequest: {
        name: "AjaxRequest",
        prototype: {}
    },
    SepiaFilter: {
        prototype: {
            sepia: function () {}
        }
    },
    _CompileShader: {
        length: 3,
        prototype: {}
    },
    RenderTexture: {
        length: 3,
        prototype: {
            resize: {
                length: 2,
                prototype: {}
            },
            renderWebGL: {
                length: 3,
                prototype: {}
            },
            renderCanvas: {
                length: 3,
                prototype: {}
            }
        }
    },
    TilingSprite: {
        length: 3,
        prototype: {
            onTextureUpdate: {
                prototype: {}
            },
            _renderWebGL: {
                length: 1,
                prototype: {}
            },
            _renderCanvas: {
                length: 1,
                prototype: {}
            },
            getBounds: {
                prototype: {}
            },
            generateTilingTexture: {
                length: 1,
                prototype: {}
            }
        }
    },
    Polygon: {
        length: 1,
        prototype: {
            clone: {
                prototype: {}
            },
            contains: {
                length: 2,
                prototype: {}
            }
        }
    },
    BitmapFontLoader: {
        length: 2,
        prototype: {
            load: {
                prototype: {}
            },
            onXMLLoaded: {
                prototype: {}
            },
            onLoaded: {
                prototype: {}
            }
        }
    },
    getNextPowerOfTwo: {
        length: 1,
        prototype: {}
    },
    WebGLFilterManager: {
        length: 2,
        prototype: {
            setContext: {
                length: 1,
                prototype: {}
            },
            begin: {
                length: 2,
                prototype: {}
            },
            pushFilter: {
                length: 1,
                prototype: {}
            },
            popFilter: {
                prototype: {}
            },
            applyFilterPass: {
                length: 4,
                prototype: {}
            },
            initShaderBuffers: {
                prototype: {}
            }
        }
    },
    DotScreenFilter: {
        prototype: {
            scale: function () {},
            angle: function () {}
        }
    },
    JsonLoader: {
        length: 2,
        prototype: {
            load: {
                prototype: {}
            },
            onJSONLoaded: {
                prototype: {}
            },
            onLoaded: {
                prototype: {}
            },
            onError: {
                prototype: {}
            }
        }
    },
    CanvasTinter: {
        prototype: {},
        getTintedTexture: {
            length: 2,
            prototype: {}
        },
        tintWithMultiply: {
            length: 3,
            prototype: {}
        },
        tintWithOverlay: {
            length: 3,
            prototype: {}
        },
        tintWithPerPixel: {
            length: 3,
            prototype: {}
        },
        roundColor: {
            length: 1,
            prototype: {}
        },
        cacheStepsPerColorChannel: 8,
        canUseMultiply: true,
        tintMethod: {
            length: 3,
            prototype: {}
        }
    },
    CrossHatchFilter: {
        prototype: {
            blur: function () {}
        }
    },
    TwistFilter: {
        prototype: {
            offset: function () {},
            radius: function () {},
            angle: function () {}
        }
    },
    ColorMatrixFilter: {
        prototype: {
            matrix: function () {}
        }
    },
    DisplayObject: {
        prototype: {
            setInteractive: {
                length: 1,
                prototype: {}
            },
            updateTransform: {
                prototype: {}
            },
            getBounds: {
                prototype: {}
            },
            getLocalBounds: {
                prototype: {}
            },
            setStageReference: {
                length: 1,
                prototype: {}
            },
            _renderWebGL: {
                length: 1,
                prototype: {}
            },
            _renderCanvas: {
                length: 1,
                prototype: {}
            }
        }
    },
    FilterTexture: {
        length: 3,
        prototype: {
            clear: {
                prototype: {}
            },
            resize: {
                length: 2,
                prototype: {}
            }
        }
    },
    canUseNewCanvasBlendModes: {
        prototype: {}
    },
    PrimitiveShader: {
        length: 1,
        prototype: {
            init: {
                prototype: {}
            }
        }
    },
    Ellipse: {
        length: 4,
        prototype: {
            clone: {
                prototype: {}
            },
            contains: {
                length: 2,
                prototype: {}
            },
            getBounds: {
                prototype: {}
            }
        }
    },
    AssetLoader: {
        length: 2,
        prototype: {
            _getDataType: {
                length: 1,
                prototype: {}
            },
            load: {
                prototype: {}
            },
            onAssetLoaded: {
                prototype: {}
            }
        }
    },
    CanvasRenderer: {
        length: 4,
        prototype: {
            render: {
                length: 1,
                prototype: {}
            },
            resize: {
                length: 2,
                prototype: {}
            },
            renderDisplayObject: {
                length: 2,
                prototype: {}
            },
            renderStripFlat: {
                length: 1,
                prototype: {}
            },
            renderStrip: {
                length: 1,
                prototype: {}
            }
        }
    },
    GrayFilter: {
        prototype: {
            gray: function () {}
        }
    },
    PixelateFilter: {
        prototype: {
            size: function () {}
        }
    },
    Circle: {
        length: 3,
        prototype: {
            clone: {
                prototype: {}
            },
            contains: {
                length: 2,
                prototype: {}
            }
        }
    },
    SpineLoader: {
        length: 2,
        prototype: {
            load: {
                prototype: {}
            },
            onLoaded: {
                prototype: {}
            }
        }
    },
    DisplayObjectContainer: {
        prototype: {
            addChild: {
                length: 1,
                prototype: {}
            },
            addChildAt: {
                length: 2,
                prototype: {}
            },
            swapChildren: {
                length: 2,
                prototype: {}
            },
            getChildAt: {
                length: 1,
                prototype: {}
            },
            removeChild: {
                length: 1,
                prototype: {}
            },
            updateTransform: {
                prototype: {}
            },
            getBounds: {
                prototype: {}
            },
            setStageReference: {
                length: 1,
                prototype: {}
            },
            removeStageReference: {
                prototype: {}
            },
            _renderWebGL: {
                length: 1,
                prototype: {}
            },
            _renderCanvas: {
                length: 1,
                prototype: {}
            }
        }
    },
    Text: {
        length: 2,
        prototype: {
            setStyle: {
                length: 1,
                prototype: {}
            },
            setText: {
                length: 1,
                prototype: {}
            },
            updateText: {
                prototype: {}
            },
            updateTexture: {
                prototype: {}
            },
            _renderWebGL: {
                length: 1,
                prototype: {}
            },
            updateTransform: {
                prototype: {}
            },
            determineFontHeight: {
                length: 1,
                prototype: {}
            },
            wordWrap: {
                length: 1,
                prototype: {}
            },
            destroy: {
                length: 1,
                prototype: {}
            }
        },
        heightCache: function () {}
    },
    PolyK: {
        Triangulate: {
            length: 1,
            prototype: {}
        },
        _PointInTriangle: {
            length: 8,
            prototype: {}
        },
        _convex: {
            length: 7,
            prototype: {}
        }
    },
    InvertFilter: {
        prototype: {
            invert: function () {}
        }
    },
    PixiShader: {
        length: 1,
        prototype: {
            init: {
                prototype: {}
            },
            initUniforms: {
                prototype: {}
            },
            initSampler2D: {
                length: 1,
                prototype: {}
            },
            syncUniforms: {
                prototype: {}
            }
        },
        defaultVertexSrc: []
    },
    compileProgram: {
        length: 3,
        prototype: {}
    },
    BaseTexture: {
        length: 2,
        prototype: {
            destroy: {
                prototype: {}
            },
            updateSourceImage: {
                length: 1,
                prototype: {}
            }
        },
        fromImage: {
            length: 3,
            prototype: {}
        },
        SCALE_MODE: {
            NEAREST: 1
        }
    },
    Rectangle: {
        length: 4,
        prototype: {
            clone: {
                prototype: {}
            },
            contains: {
                length: 2,
                prototype: {}
            }
        }
    },
    FrameCache: function () {},
    Spine: {
        length: 1,
        prototype: {
            updateTransform: {
                prototype: {}
            },
            createSprite: {
                length: 2,
                prototype: {}
            }
        }
    },
    ColorStepFilter: {
        prototype: {
            step: function () {}
        }
    },
    CanvasMaskManager: {
        prototype: {
            pushMask: {
                length: 2,
                prototype: {}
            },
            popMask: {
                length: 1,
                prototype: {}
            }
        }
    },
    InteractionData: {
        prototype: {
            getLocalPosition: {
                length: 1,
                prototype: {}
            }
        }
    },
    AbstractFilter: {
        length: 2,
        prototype: {}
    },
    BlurYFilter: {
        prototype: {
            blur: function () {}
        }
    },
    FilterBlock: {
        prototype: {}
    },
    CANVAS_RENDERER: 1,
    Graphics: {
        prototype: {
            drawRect: {
                length: 4,
                prototype: {}
            },
            _renderCanvas: {
                length: 1,
                prototype: {}
            },
            generateTexture: {
                prototype: {}
            },
            lineTo: {
                length: 2,
                prototype: {}
            },
            destroyCachedSprite: {
                prototype: {}
            },
            endFill: {
                prototype: {}
            },
            updateBounds: {
                prototype: {}
            },
            _generateCachedSprite: {
                prototype: {}
            },
            clear: {
                prototype: {}
            },
            drawCircle: {
                length: 3,
                prototype: {}
            },
            lineStyle: {
                length: 3,
                prototype: {}
            },
            getBounds: {
                prototype: {}
            },
            drawEllipse: {
                length: 4,
                prototype: {}
            },
            _renderWebGL: {
                length: 1,
                prototype: {}
            },
            beginFill: {
                length: 2,
                prototype: {}
            },
            moveTo: {
                length: 2,
                prototype: {}
            }
        },
        RECT: 1,
        CIRC: 2,
        ELIP: 3
    },
    autoDetectRenderer: {
        length: 5,
        prototype: {}
    },
    Point: {
        length: 2,
        prototype: {
            clone: {
                prototype: {}
            }
        }
    },
    rgb2hex: {
        length: 1,
        prototype: {}
    },
    DisplacementFilter: {
        length: 1,
        prototype: {
            onTextureLoaded: {
                prototype: {}
            },
            map: function () {},
            scale: function () {},
            offset: function () {}
        }
    },
    CompileVertexShader: {
        length: 2,
        prototype: {}
    },
    WebGLRenderer: {
        length: 5,
        prototype: {
            render: {
                length: 1,
                prototype: {}
            },
            renderDisplayObject: {
                length: 2,
                prototype: {}
            },
            resize: {
                length: 2,
                prototype: {}
            },
            handleContextLost: {
                length: 1,
                prototype: {}
            },
            handleContextRestored: {
                prototype: {}
            }
        },
        updateTextures: {
            prototype: {}
        },
        destroyTexture: {
            length: 1,
            prototype: {}
        },
        updateTextureFrame: {
            length: 1,
            prototype: {}
        }
    },
    initDefaultShaders: {
        prototype: {}
    },
    WebGLShaderManager: {
        length: 1,
        prototype: {
            setContext: {
                length: 1,
                prototype: {}
            },
            activatePrimitiveShader: {
                prototype: {}
            },
            deactivatePrimitiveShader: {
                prototype: {}
            }
        }
    },
    mat4: {
        create: {
            prototype: {}
        },
        transpose: {
            length: 2,
            prototype: {}
        },
        multiply: {
            length: 3,
            prototype: {}
        }
    },
    MovieClip: {
        length: 1,
        prototype: {
            totalFrames: function () {},
            stop: {
                prototype: {}
            },
            play: {
                prototype: {}
            },
            gotoAndStop: {
                length: 1,
                prototype: {}
            },
            gotoAndPlay: {
                length: 1,
                prototype: {}
            },
            updateTransform: {
                prototype: {}
            }
        }
    },
    AnimCache: function () {},
    TextureCache: function () {},
    Sprite: {
        length: 1,
        prototype: {
            width: function () {},
            height: function () {},
            setTexture: {
                length: 1,
                prototype: {}
            },
            onTextureUpdate: {
                prototype: {}
            },
            getBounds: {
                prototype: {}
            },
            _renderWebGL: {
                length: 1,
                prototype: {}
            },
            _renderCanvas: {
                length: 1,
                prototype: {}
            }
        },
        fromFrame: {
            length: 1,
            prototype: {}
        },
        fromImage: {
            length: 1,
            prototype: {}
        },
        tint : {}
    },
    Strip: {
        length: 3,
        prototype: {
            setTexture: {
                length: 1,
                prototype: {}
            },
            onTextureUpdate: {
                prototype: {}
            }
        }
    },
    BlurFilter: {
        prototype: {
            blur: function () {},
            blurX: function () {},
            blurY: function () {}
        }
    },
    Texture: {
        length: 2,
        prototype: {
            onBaseTextureLoaded: {
                prototype: {}
            },
            destroy: {
                length: 1,
                prototype: {}
            },
            setFrame: {
                length: 1,
                prototype: {}
            },
            _updateWebGLuvs: {
                prototype: {}
            }
        },
        fromImage: {
            length: 3,
            prototype: {}
        },
        fromFrame: {
            length: 1,
            prototype: {}
        },
        fromCanvas: {
            length: 2,
            prototype: {}
        },
        addTextureToCache: {
            length: 2,
            prototype: {}
        },
        removeTextureFromCache: {
            length: 1,
            prototype: {}
        },
        frameUpdates: [],
        SCALE_MODE: {
            NEAREST: 1
        }
    },
    EmptyRectangle: {},
    glContexts: [],
    SpriteSheetLoader: {
        length: 2,
        prototype: {
            load: {
                prototype: {}
            },
            onLoaded: {
                prototype: {}
            }
        }
    },
    WebGLGraphics: {
        prototype: {},
        renderGraphics: {
            length: 2,
            prototype: {}
        },
        updateGraphics: {
            length: 2,
            prototype: {}
        },
        buildRectangle: {
            length: 2,
            prototype: {}
        },
        buildCircle: {
            length: 2,
            prototype: {}
        },
        buildLine: {
            length: 2,
            prototype: {}
        },
        buildPoly: {
            length: 2,
            prototype: {}
        }
    },
    identityMatrix: {
        0: 1,
        4: 1,
        8: 1
    },
    BlurXFilter: {
        prototype: {
            blur: function () {}
        }
    },
    RGBSplitFilter: {
        prototype: {
            angle: function () {}
        }
    },
    ImageLoader: {
        length: 2,
        prototype: {
            load: {
                prototype: {}
            },
            onLoaded: {
                prototype: {}
            },
            loadFramedSpriteSheet: {
                length: 3,
                prototype: {}
            }
        }
    },
    texturesToDestroy: [],
    AlphaMaskFilter: {
        length: 1,
        prototype: {
            onTextureLoaded: {
                prototype: {}
            },
            map: function () {}
        }
    },
    BitmapText: {
        length: 2,
        prototype: {
            setText: {
                length: 1,
                prototype: {}
            },
            setStyle: {
                length: 1,
                prototype: {}
            },
            updateText: {
                prototype: {}
            },
            updateTransform: {
                prototype: {}
            }
        },
        fonts: function () {}
    },
    BaseTextureCache: function () {},
    updateWebGLTexture: {
        length: 2,
        prototype: {}
    }
};