import type { IBasePhysicsCollisionEvent, IPhysicsCollisionEvent, PhysicsMassProperties } from "./IPhysicsEnginePlugin.js";
import { PhysicsMotionType } from "./IPhysicsEnginePlugin.js";
import type { PhysicsShape } from "./physicsShape.js";
import { Vector3, Quaternion } from "../../Maths/math.vector";
import type { Scene } from "../../scene";
import type { Nullable } from "../../types.js";
import type { PhysicsConstraint } from "./physicsConstraint.js";
import type { Bone } from "../../Bones/bone.js";
import type { Observable } from "../../Misc/observable";
import type { AbstractMesh } from "../../Meshes/abstractMesh";
import type { TransformNode } from "../../Meshes/transformNode";
/**
 * PhysicsBody is useful for creating a physics body that can be used in a physics engine. It allows
 * the user to set the mass and velocity of the body, which can then be used to calculate the
 * motion of the body in the physics engine.
 */
export declare class PhysicsBody {
    /**
     * V2 Physics plugin private data for single Transform
     */
    _pluginData: any;
    /**
     * V2 Physics plugin private data for instances
     */
    _pluginDataInstances: Array<any>;
    /**
     * The V2 plugin used to create and manage this Physics Body
     */
    private _physicsPlugin;
    /**
     * The engine used to create and manage this Physics Body
     */
    private _physicsEngine;
    /**
     * If the collision callback is enabled
     */
    private _collisionCBEnabled;
    /**
     * If the collision ended callback is enabled
     */
    private _collisionEndedCBEnabled;
    /**
     * The transform node associated with this Physics Body
     */
    transformNode: TransformNode;
    /**
     * Disable pre-step that consists in updating Physics Body from Transform Node Translation/Orientation.
     * True by default for maximum performance.
     */
    disablePreStep: boolean;
    /**
     * Disable sync from physics to transformNode. This value is set to true at body creation or at motionType setting when the body is not dynamic.
     */
    disableSync: boolean;
    /**
     * Physics engine will try to make this body sleeping and not active
     */
    startAsleep: boolean;
    private _nodeDisposeObserver;
    private _isDisposed;
    private _shape;
    private _motionType;
    /**
     * Constructs a new physics body for the given node.
     * @param transformNode - The Transform Node to construct the physics body for. For better performance, it is advised that this node does not have a parent.
     * @param motionType - The motion type of the physics body. The options are:
     *  - PhysicsMotionType.STATIC - Static bodies are not moving and unaffected by forces or collisions. They are good for level boundaries or terrain.
     *  - PhysicsMotionType.DYNAMIC - Dynamic bodies are fully simulated. They can move and collide with other objects.
     *  - PhysicsMotionType.ANIMATED - They behave like dynamic bodies, but they won't be affected by other bodies, but still push other bodies out of the way.
     * @param startsAsleep - Whether the physics body should start in a sleeping state (not a guarantee). Defaults to false.
     * @param scene - The scene containing the physics engine.
     *
     * This code is useful for creating a physics body for a given Transform Node in a scene.
     * It checks the version of the physics engine and the physics plugin, and initializes the body accordingly.
     * It also sets the node's rotation quaternion if it is not already set. Finally, it adds the body to the physics engine.
     */
    constructor(transformNode: TransformNode, motionType: PhysicsMotionType, startsAsleep: boolean, scene: Scene);
    /**
     * Returns the string "PhysicsBody".
     * @returns "PhysicsBody"
     */
    getClassName(): string;
    /**
     * Clone the PhysicsBody to a new body and assign it to the transformNode parameter
     * @param transformNode transformNode that will be used for the cloned PhysicsBody
     * @returns the newly cloned PhysicsBody
     */
    clone(transformNode: TransformNode): PhysicsBody;
    /**
     * If a physics body is connected to an instanced node, update the number physic instances to match the number of node instances.
     */
    updateBodyInstances(): void;
    /**
     * This returns the number of internal instances of the physics body
     */
    get numInstances(): number;
    /**
     * Get the motion type of the physics body. Can be STATIC, DYNAMIC, or ANIMATED.
     */
    get motionType(): PhysicsMotionType;
    /**
     * Sets the shape of the physics body.
     * @param shape - The shape of the physics body.
     *
     * This method is useful for setting the shape of the physics body, which is necessary for the physics engine to accurately simulate the body's behavior.
     * The shape is used to calculate the body's mass, inertia, and other properties.
     */
    set shape(shape: Nullable<PhysicsShape>);
    /**
     * Retrieves the physics shape associated with this object.
     *
     * @returns The physics shape associated with this object, or `undefined` if no
     * shape is associated.
     *
     * This method is useful for retrieving the physics shape associated with this object,
     * which can be used to apply physical forces to the object or to detect collisions.
     */
    get shape(): Nullable<PhysicsShape>;
    /**
     * Sets the event mask for the physics engine.
     *
     * @param eventMask - A bitmask that determines which events will be sent to the physics engine.
     * @param instanceIndex - If this body is instanced, the index of the instance to set the event mask for.
     *
     * This method is useful for setting the event mask for the physics engine, which determines which events
     * will be sent to the physics engine. This allows the user to control which events the physics engine will respond to.
     */
    setEventMask(eventMask: number, instanceIndex?: number): void;
    /**
     * Gets the event mask of the physics engine.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the event mask for.
     * @returns The event mask of the physics engine.
     *
     * This method is useful for getting the event mask of the physics engine,
     * which is used to determine which events the engine will respond to.
     * This is important for ensuring that the engine is responding to the correct events and not
     * wasting resources on unnecessary events.
     */
    getEventMask(instanceIndex?: number): number;
    /**
     * Sets the motion type of the physics body. Can be STATIC, DYNAMIC, or ANIMATED.
     * @param motionType - The motion type to set.
     * @param instanceIndex - If this body is instanced, the index of the instance to set the motion type for.
     */
    setMotionType(motionType: PhysicsMotionType, instanceIndex?: number): void;
    /**
     * Gets the motion type of the physics body. Can be STATIC, DYNAMIC, or ANIMATED.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the motion type for.
     * @returns The motion type of the physics body.
     */
    getMotionType(instanceIndex?: number): PhysicsMotionType;
    /**
     * Computes the mass properties of the physics object, based on the set of physics shapes this body uses.
     * This method is useful for computing the initial mass properties of a physics object, such as its mass,
     * inertia, and center of mass; these values are important for accurately simulating the physics of the
     * object in the physics engine, and computing values based on the shape will provide you with reasonable
     * initial values, which you can then customize.
     * @param instanceIndex - The index of the instance to compute the mass properties for.
     * @returns The mass properties of the object.
     */
    computeMassProperties(instanceIndex?: number): PhysicsMassProperties;
    /**
     * Sets the mass properties of the physics object.
     *
     * @param massProps - The mass properties to set.
     * @param instanceIndex - The index of the instance to set the mass properties for. If not defined, the mass properties will be set for all instances.
     *
     * This method is useful for setting the mass properties of a physics object, such as its mass,
     * inertia, and center of mass. This is important for accurately simulating the physics of the object in the physics engine.
     */
    setMassProperties(massProps: PhysicsMassProperties, instanceIndex?: number): void;
    /**
     * Retrieves the mass properties of the object.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the mass properties for.
     * @returns The mass properties of the object.
     *
     * This method is useful for physics simulations, as it allows the user to
     * retrieve the mass properties of the object, such as its mass, center of mass,
     * and moment of inertia. This information is necessary for accurate physics
     * simulations.
     */
    getMassProperties(instanceIndex?: number): PhysicsMassProperties;
    /**
     * Sets the linear damping of the physics body.
     *
     * @param damping - The linear damping value.
     * @param instanceIndex - If this body is instanced, the index of the instance to set the linear damping for.
     *
     * This method is useful for controlling the linear damping of the physics body,
     * which is the rate at which the body's velocity decreases over time. This is useful for simulating
     * the effects of air resistance or other forms of friction.
     */
    setLinearDamping(damping: number, instanceIndex?: number): void;
    /**
     * Gets the linear damping of the physics body.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the linear damping for.
     * @returns The linear damping of the physics body.
     *
     * This method is useful for retrieving the linear damping of the physics body, which is the amount of
     * resistance the body has to linear motion. This is useful for simulating realistic physics behavior
     * in a game.
     */
    getLinearDamping(instanceIndex?: number): number;
    /**
     * Sets the angular damping of the physics body.
     * @param damping The angular damping of the body.
     * @param instanceIndex - If this body is instanced, the index of the instance to set the angular damping for.
     *
     * This method is useful for controlling the angular velocity of a physics body.
     * By setting the damping, the body's angular velocity will be reduced over time, simulating the effect of friction.
     * This can be used to create realistic physical behavior in a physics engine.
     */
    setAngularDamping(damping: number, instanceIndex?: number): void;
    /**
     * Gets the angular damping of the physics body.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the angular damping for.
     *
     * @returns The angular damping of the physics body.
     *
     * This method is useful for getting the angular damping of the physics body,
     * which is the rate of reduction of the angular velocity over time.
     * This is important for simulating realistic physics behavior in a game.
     */
    getAngularDamping(instanceIndex?: number): number;
    /**
     * Sets the linear velocity of the physics object.
     * @param linVel - The linear velocity to set.
     * @param instanceIndex - If this body is instanced, the index of the instance to set the linear velocity for.
     *
     * This method is useful for setting the linear velocity of a physics object,
     * which is necessary for simulating realistic physics in a game engine.
     * By setting the linear velocity, the physics object will move in the direction and speed specified by the vector.
     * This allows for realistic physics simulations, such as simulating the motion of a ball rolling down a hill.
     */
    setLinearVelocity(linVel: Vector3, instanceIndex?: number): void;
    /**
     * Gets the linear velocity of the physics body and stores it in the given vector3.
     * @param linVel - The vector3 to store the linear velocity in.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the linear velocity for.
     *
     * This method is useful for getting the linear velocity of a physics body in a physics engine.
     * This can be used to determine the speed and direction of the body, which can be used to calculate the motion of the body.
     */
    getLinearVelocityToRef(linVel: Vector3, instanceIndex?: number): void;
    /**
     * Gets the linear velocity of the physics body as a new vector3.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the linear velocity for.
     * @returns The linear velocity of the physics body.
     *
     * This method is useful for getting the linear velocity of a physics body in a physics engine.
     * This can be used to determine the speed and direction of the body, which can be used to calculate the motion of the body.
     */
    getLinearVelocity(instanceIndex?: number): Vector3;
    /**
     * Sets the angular velocity of the physics object.
     * @param angVel - The angular velocity to set.
     * @param instanceIndex - If this body is instanced, the index of the instance to set the angular velocity for.
     *
     * This method is useful for setting the angular velocity of a physics object, which is necessary for
     * simulating realistic physics behavior. The angular velocity is used to determine the rate of rotation of the object,
     * which is important for simulating realistic motion.
     */
    setAngularVelocity(angVel: Vector3, instanceIndex?: number): void;
    /**
     * Gets the angular velocity of the physics body and stores it in the given vector3.
     * @param angVel - The vector3 to store the angular velocity in.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the angular velocity for.
     *
     * This method is useful for getting the angular velocity of a physics body, which can be used to determine the body's
     * rotational speed. This information can be used to create realistic physics simulations.
     */
    getAngularVelocityToRef(angVel: Vector3, instanceIndex?: number): void;
    /**
     * Gets the angular velocity of the physics body as a new vector3.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the angular velocity for.
     * @returns The angular velocity of the physics body.
     *
     * This method is useful for getting the angular velocity of a physics body, which can be used to determine the body's
     * rotational speed. This information can be used to create realistic physics simulations.
     */
    getAngularVelocity(instanceIndex?: number): Vector3;
    /**
     * Applies an impulse to the physics object.
     *
     * @param impulse The impulse vector.
     * @param location The location of the impulse.
     * @param instanceIndex For a instanced body, the instance to where the impulse should be applied. If not specified, the impulse is applied to all instances.
     *
     * This method is useful for applying an impulse to a physics object, which can be used to simulate physical forces such as gravity,
     * collisions, and explosions. This can be used to create realistic physics simulations in a game or other application.
     */
    applyImpulse(impulse: Vector3, location: Vector3, instanceIndex?: number): void;
    /**
     * Add torque to a physics body
     * @param angularImpulse The angular impulse vector.
     * @param instanceIndex For a instanced body, the instance to where the impulse should be applied. If not specified, the impulse is applied to all instances.
     */
    applyAngularImpulse(angularImpulse: Vector3, instanceIndex?: number): void;
    /**
     * Applies a force to the physics object.
     *
     * @param force The force vector.
     * @param location The location of the force.
     * @param instanceIndex For a instanced body, the instance to where the force should be applied. If not specified, the force is applied to all instances.
     *
     * This method is useful for applying a force to a physics object, which can be used to simulate physical forces such as gravity,
     * collisions, and explosions. This can be used to create realistic physics simulations in a game or other application.
     */
    applyForce(force: Vector3, location: Vector3, instanceIndex?: number): void;
    /**
     * Retrieves the geometry of the body from the physics plugin.
     *
     * @returns The geometry of the body.
     *
     * This method is useful for retrieving the geometry of the body from the physics plugin, which can be used for various physics calculations.
     */
    getGeometry(): {};
    /**
     * Returns an observable that will be notified for when a collision starts or continues for this PhysicsBody
     * @returns Observable
     */
    getCollisionObservable(): Observable<IPhysicsCollisionEvent>;
    /**
     * Returns an observable that will be notified when the body has finished colliding with another body
     * @returns
     */
    getCollisionEndedObservable(): Observable<IBasePhysicsCollisionEvent>;
    /**
     * Enable or disable collision callback for this PhysicsBody.
     * @param enabled true if PhysicsBody's collision will rise a collision event and notifies the observable
     */
    setCollisionCallbackEnabled(enabled: boolean): void;
    /**
     * Enable or disable collision ended callback for this PhysicsBody.
     * @param enabled true if PhysicsBody's collision ended will rise a collision event and notifies the observable
     */
    setCollisionEndedCallbackEnabled(enabled: boolean): void;
    /**
     * Get the center of the object in world space.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the center for.
     * @returns geometric center of the associated mesh
     */
    getObjectCenterWorld(instanceIndex?: number): Vector3;
    /**
     * Get the center of the object in world space.
     * @param ref - The vector3 to store the result in.
     * @param instanceIndex - If this body is instanced, the index of the instance to get the center for.
     * @returns geometric center of the associated mesh
     */
    getObjectCenterWorldToRef(ref: Vector3, instanceIndex?: number): Vector3;
    /**
     * Adds a constraint to the physics engine.
     *
     * @param childBody - The body to which the constraint will be applied.
     * @param constraint - The constraint to be applied.
     * @param instanceIndex - If this body is instanced, the index of the instance to which the constraint will be applied. If not specified, no constraint will be applied.
     * @param childInstanceIndex - If the child body is instanced, the index of the instance to which the constraint will be applied. If not specified, no constraint will be applied.
     *
     */
    addConstraint(childBody: PhysicsBody, constraint: PhysicsConstraint, instanceIndex?: number, childInstanceIndex?: number): void;
    /**
     * Sync with a bone
     * @param bone The bone that the impostor will be synced to.
     * @param boneMesh The mesh that the bone is influencing.
     * @param jointPivot The pivot of the joint / bone in local space.
     * @param distToJoint Optional distance from the impostor to the joint.
     * @param adjustRotation Optional quaternion for adjusting the local rotation of the bone.
     * @param boneAxis Optional vector3 axis the bone is aligned with
     */
    syncWithBone(bone: Bone, boneMesh: AbstractMesh, jointPivot: Vector3, distToJoint?: number, adjustRotation?: Quaternion, boneAxis?: Vector3): void;
    /**
     * Executes a callback on the body or all of the instances of a body
     * @param callback the callback to execute
     */
    iterateOverAllInstances(callback: (body: PhysicsBody, instanceIndex?: number) => void): void;
    /**
     * Sets the gravity factor of the physics body
     * @param factor the gravity factor to set
     * @param instanceIndex the instance of the body to set, if undefined all instances will be set
     */
    setGravityFactor(factor: number, instanceIndex?: number): void;
    /**
     * Gets the gravity factor of the physics body
     * @param instanceIndex the instance of the body to get, if undefined the value of first instance will be returned
     * @returns the gravity factor
     */
    getGravityFactor(instanceIndex?: number): number;
    /**
     * Set the target transformation (position and rotation) of the body, such that the body will set its velocity to reach that target
     * @param position The target position
     * @param rotation The target rotation
     * @param instanceIndex The index of the instance in an instanced body
     */
    setTargetTransform(position: Vector3, rotation: Quaternion, instanceIndex?: number): void;
    /**
     * Returns if the body has been disposed.
     * @returns true if disposed, false otherwise.
     */
    get isDisposed(): boolean;
    /**
     * Disposes the body from the physics engine.
     *
     * This method is useful for cleaning up the physics engine when a body is no longer needed. Disposing the body will free up resources and prevent memory leaks.
     */
    dispose(): void;
}
