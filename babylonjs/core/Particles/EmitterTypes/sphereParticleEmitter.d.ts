import type { Matrix } from "../../Maths/math.vector";
import { Vector3 } from "../../Maths/math.vector";
import type { Particle } from "../particle";
import type { IParticleEmitterType } from "./IParticleEmitterType";
import type { UniformBufferEffectCommonAccessor } from "../../Materials/uniformBufferEffectCommonAccessor";
import type { UniformBuffer } from "../../Materials/uniformBuffer";
/**
 * Particle emitter emitting particles from the inside of a sphere.
 * It emits the particles alongside the sphere radius. The emission direction might be randomized.
 */
export declare class SphereParticleEmitter implements IParticleEmitterType {
    /**
     * The radius of the emission sphere.
     */
    radius: number;
    /**
     * The range of emission [0-1] 0 Surface only, 1 Entire Radius.
     */
    radiusRange: number;
    /**
     * How much to randomize the particle direction [0-1].
     */
    directionRandomizer: number;
    /**
     * Creates a new instance SphereParticleEmitter
     * @param radius the radius of the emission sphere (1 by default)
     * @param radiusRange the range of the emission sphere [0-1] 0 Surface only, 1 Entire Radius (1 by default)
     * @param directionRandomizer defines how much to randomize the particle direction [0-1]
     */
    constructor(
    /**
     * The radius of the emission sphere.
     */
    radius?: number, 
    /**
     * The range of emission [0-1] 0 Surface only, 1 Entire Radius.
     */
    radiusRange?: number, 
    /**
     * How much to randomize the particle direction [0-1].
     */
    directionRandomizer?: number);
    /**
     * Called by the particle System when the direction is computed for the created particle.
     * @param worldMatrix is the world matrix of the particle system
     * @param directionToUpdate is the direction vector to update with the result
     * @param particle is the particle we are computed the direction for
     * @param isLocal defines if the direction should be set in local space
     */
    startDirectionFunction(worldMatrix: Matrix, directionToUpdate: Vector3, particle: Particle, isLocal: boolean): void;
    /**
     * Called by the particle System when the position is computed for the created particle.
     * @param worldMatrix is the world matrix of the particle system
     * @param positionToUpdate is the position vector to update with the result
     * @param particle is the particle we are computed the position for
     * @param isLocal defines if the position should be set in local space
     */
    startPositionFunction(worldMatrix: Matrix, positionToUpdate: Vector3, particle: Particle, isLocal: boolean): void;
    /**
     * Clones the current emitter and returns a copy of it
     * @returns the new emitter
     */
    clone(): SphereParticleEmitter;
    /**
     * Called by the GPUParticleSystem to setup the update shader
     * @param uboOrEffect defines the update shader
     */
    applyToShader(uboOrEffect: UniformBufferEffectCommonAccessor): void;
    /**
     * Creates the structure of the ubo for this particle emitter
     * @param ubo ubo to create the structure for
     */
    buildUniformLayout(ubo: UniformBuffer): void;
    /**
     * Returns a string to use to update the GPU particles update shader
     * @returns a string containing the defines string
     */
    getEffectDefines(): string;
    /**
     * Returns the string "SphereParticleEmitter"
     * @returns a string containing the class name
     */
    getClassName(): string;
    /**
     * Serializes the particle system to a JSON object.
     * @returns the JSON object
     */
    serialize(): any;
    /**
     * Parse properties from a JSON object
     * @param serializationObject defines the JSON object
     */
    parse(serializationObject: any): void;
}
/**
 * Particle emitter emitting particles from the inside of a sphere.
 * It emits the particles randomly between two vectors.
 */
export declare class SphereDirectedParticleEmitter extends SphereParticleEmitter {
    /**
     * The min limit of the emission direction.
     */
    direction1: Vector3;
    /**
     * The max limit of the emission direction.
     */
    direction2: Vector3;
    /**
     * Creates a new instance SphereDirectedParticleEmitter
     * @param radius the radius of the emission sphere (1 by default)
     * @param direction1 the min limit of the emission direction (up vector by default)
     * @param direction2 the max limit of the emission direction (up vector by default)
     */
    constructor(radius?: number, 
    /**
     * The min limit of the emission direction.
     */
    direction1?: Vector3, 
    /**
     * The max limit of the emission direction.
     */
    direction2?: Vector3);
    /**
     * Called by the particle System when the direction is computed for the created particle.
     * @param worldMatrix is the world matrix of the particle system
     * @param directionToUpdate is the direction vector to update with the result
     */
    startDirectionFunction(worldMatrix: Matrix, directionToUpdate: Vector3): void;
    /**
     * Clones the current emitter and returns a copy of it
     * @returns the new emitter
     */
    clone(): SphereDirectedParticleEmitter;
    /**
     * Called by the GPUParticleSystem to setup the update shader
     * @param uboOrEffect defines the update shader
     */
    applyToShader(uboOrEffect: UniformBufferEffectCommonAccessor): void;
    /**
     * Creates the structure of the ubo for this particle emitter
     * @param ubo ubo to create the structure for
     */
    buildUniformLayout(ubo: UniformBuffer): void;
    /**
     * Returns a string to use to update the GPU particles update shader
     * @returns a string containing the defines string
     */
    getEffectDefines(): string;
    /**
     * Returns the string "SphereDirectedParticleEmitter"
     * @returns a string containing the class name
     */
    getClassName(): string;
    /**
     * Serializes the particle system to a JSON object.
     * @returns the JSON object
     */
    serialize(): any;
    /**
     * Parse properties from a JSON object
     * @param serializationObject defines the JSON object
     */
    parse(serializationObject: any): void;
}
