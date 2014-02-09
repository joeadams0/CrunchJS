// This file was autogenerated by app/closure-library/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../../../js/engine/components/Body.js', ['CrunchJS.Components.Body'], ['CrunchJS.Component', 'goog.math.Size']);
goog.addDependency('../../../js/engine/components/Components.js', ['CrunchJS.Components'], []);
goog.addDependency('../../../js/engine/components/Impulse.js', ['CrunchJS.Components.Impulse'], ['CrunchJS.Component']);
goog.addDependency('../../../js/engine/components/Occupancy.js', ['CrunchJS.Components.Occupancy'], ['CrunchJS.Component']);
goog.addDependency('../../../js/engine/components/OccupancyGrid.js', ['CrunchJS.Components.OccupancyGrid'], ['CrunchJS.Component', 'CrunchJS.Helpers.OccupancyGridHelper']);
goog.addDependency('../../../js/engine/components/Transform.js', ['CrunchJS.Components.Transform'], ['CrunchJS.Component']);
goog.addDependency('../../../js/engine/core/Component.js', ['CrunchJS.Component'], []);
goog.addDependency('../../../js/engine/core/EntityComposition.js', ['CrunchJS.EntityComposition'], ['CrunchJS.Utils.BitSetOperator', 'goog.array']);
goog.addDependency('../../../js/engine/core/Frame.js', ['CrunchJS.Frame'], []);
goog.addDependency('../../../js/engine/core/Scene.js', ['CrunchJS.Scene'], ['CrunchJS.Internal.ComponentManager', 'CrunchJS.Internal.EntityManager', 'CrunchJS.Internal.EventManager', 'CrunchJS.Internal.SystemManager', 'CrunchJS.Network.Channel.WebWorkerChannel', 'goog.object']);
goog.addDependency('../../../js/engine/core/System.js', ['CrunchJS.System'], ['goog.structs', 'goog.structs.Set']);
goog.addDependency('../../../js/engine/core/world.js', ['CrunchJS', 'CrunchJS.DATA_SYNC_DEBUG', 'CrunchJS.DEBUG', 'CrunchJS.EngineCommands', 'CrunchJS.Events', 'CrunchJS.LogLevels', 'CrunchJS.World', 'CrunchJS.world'], ['CrunchJS.Internal.FrameManager', 'CrunchJS.Internal.SceneManager', 'CrunchJS.Network.Channel.WebWorkerChannel', 'CrunchJS.Network.RemoteEngine.MainRemoteEngine', 'CrunchJS.Utils.vendor', 'goog.Timer', 'goog.events', 'goog.object']);
goog.addDependency('../../../js/engine/helpers/Helpers.js', ['CrunchJS.Helpers'], []);
goog.addDependency('../../../js/engine/helpers/OccupancyGridHelper.js', ['CrunchJS.Helpers.OccupancyGridHelper'], ['goog.array', 'goog.math', 'goog.math.Rect']);
goog.addDependency('../../../js/engine/internal/ComponentManager.js', ['CrunchJS.Internal.ComponentManager'], ['CrunchJS.EntityComposition', 'CrunchJS.Internal.Manager', 'CrunchJS.Utils.BitSetOperator', 'goog.array', 'goog.object', 'goog.structs', 'goog.structs.Map', 'goog.structs.Set']);
goog.addDependency('../../../js/engine/internal/EntityManager.js', ['CrunchJS.Internal.EntityManager'], ['CrunchJS.Internal.Manager', 'goog.array', 'goog.object', 'goog.structs.Map', 'goog.structs.Set']);
goog.addDependency('../../../js/engine/internal/EventManager.js', ['CrunchJS.Internal.EventManager'], ['goog.array', 'goog.structs', 'goog.structs.Map', 'goog.structs.Set']);
goog.addDependency('../../../js/engine/internal/FrameManager.js', ['CrunchJS.Internal.FrameManager'], ['CrunchJS.Frame']);
goog.addDependency('../../../js/engine/internal/Manager.js', ['CrunchJS.Internal.Manager'], []);
goog.addDependency('../../../js/engine/internal/SceneManager.js', ['CrunchJS.Internal.SceneManager'], ['goog.structs', 'goog.structs.Map']);
goog.addDependency('../../../js/engine/internal/SystemManager.js', ['CrunchJS.Internal.SystemManager'], ['CrunchJS.Internal.Manager', 'goog.array']);
goog.addDependency('../../../js/engine/libs/box2d/collision/ClipVertex.js', ['box2d.ClipVertex'], ['box2d.ContactID', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/Features.js', ['box2d.Features'], []);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2AABB.js', ['box2d.AABB'], ['box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2Bound.js', ['box2d.Bound'], []);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2BoundValues.js', ['box2d.BoundValues'], []);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2BroadPhase.js', ['box2d.BroadPhase'], ['box2d.Bound', 'box2d.BoundValues', 'box2d.PairManager', 'box2d.Proxy', 'box2d.Settings', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2BufferedPair.js', ['box2d.BufferedPair'], []);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2Collision.js', ['box2d.Collision'], ['box2d.ClipVertex']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2ContactID.js', ['box2d.ContactID'], ['box2d.Features']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2ContactPoint.js', ['box2d.ContactPoint'], ['box2d.ContactID', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2Distance.js', ['box2d.Distance'], ['box2d.Math']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2Manifold.js', ['box2d.Manifold'], ['box2d.ContactPoint', 'box2d.Settings', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2OBB.js', ['box2d.OBB'], ['box2d.Mat22', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2Pair.js', ['box2d.Pair'], ['box2d.Settings']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2PairCallback.js', ['box2d.PairCallback'], []);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2PairManager.js', ['box2d.PairManager'], ['box2d.BufferedPair', 'box2d.Pair']);
goog.addDependency('../../../js/engine/libs/box2d/collision/b2Proxy.js', ['box2d.Proxy'], ['box2d.Settings']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2BoxDef.js', ['box2d.BoxDef'], ['box2d.Shape', 'box2d.ShapeDef', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2CircleDef.js', ['box2d.CircleDef'], ['box2d.Shape', 'box2d.ShapeDef']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2CircleShape.js', ['box2d.CircleShape'], ['box2d.AABB', 'box2d.CircleDef', 'box2d.Mat22', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2MassData.js', ['box2d.MassData'], ['box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2PolyDef.js', ['box2d.PolyDef'], ['box2d.Shape', 'box2d.ShapeDef', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2PolyShape.js', ['box2d.PolyShape'], ['box2d.AABB', 'box2d.BoxDef', 'box2d.Mat22', 'box2d.OBB', 'box2d.PolyDef', 'box2d.Settings', 'box2d.Shape', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2Shape.js', ['box2d.Shape'], ['box2d.Mat22', 'box2d.ShapeDef', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2ShapeDef.js', ['box2d.ShapeDef'], ['box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/collision/shapes/b2ShapeFactory.js', ['box2d.ShapeFactory'], ['box2d.BoxDef', 'box2d.CircleDef', 'box2d.CircleShape', 'box2d.PolyDef', 'box2d.PolyShape', 'box2d.ShapeDef']);
goog.addDependency('../../../js/engine/libs/box2d/common/b2Mat22.js', ['box2d.Mat22'], []);
goog.addDependency('../../../js/engine/libs/box2d/common/b2Math.js', ['box2d.Math'], ['box2d.Mat22', 'box2d.Vec2', 'goog.math']);
goog.addDependency('../../../js/engine/libs/box2d/common/b2Settings.js', ['box2d.Settings'], []);
goog.addDependency('../../../js/engine/libs/box2d/common/b2Vec2.js', ['box2d.Vec2'], ['goog.math.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2Body.js', ['box2d.Body'], ['box2d.MassData', 'box2d.Mat22', 'box2d.Math', 'box2d.ShapeFactory', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2BodyDef.js', ['box2d.BodyDef'], ['box2d.Settings', 'box2d.ShapeDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2CollisionFilter.js', ['box2d.CollisionFilter'], []);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2ContactManager.js', ['box2d.ContactManager'], ['box2d.Contact', 'box2d.ContactFactory', 'box2d.NullContact', 'box2d.PairCallback']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2Island.js', ['box2d.Island'], ['box2d.ContactSolver']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2TimeStep.js', ['box2d.TimeStep'], []);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2World.js', ['box2d.World'], ['box2d.Body', 'box2d.BodyDef', 'box2d.BroadPhase', 'box2d.CollisionFilter', 'box2d.ContactManager', 'box2d.Island', 'box2d.JointDef', 'box2d.JointFactory', 'box2d.TimeStep', 'box2d.WorldListener']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/b2WorldListener.js', ['box2d.WorldListener'], []);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2CircleContact.js', ['box2d.CircleContact'], ['box2d.CircleShape', 'box2d.Collision', 'box2d.Contact', 'box2d.Manifold']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2Conservative.js', ['box2d.Conservative'], []);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2Contact.js', ['box2d.Contact'], ['box2d.ContactNode', 'box2d.ContactRegister']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2ContactConstraint.js', ['box2d.ContactConstraint'], ['box2d.ContactConstraintPoint', 'box2d.Settings', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2ContactConstraintPoint.js', ['box2d.ContactConstraintPoint'], ['box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2ContactFactory.js', ['box2d.ContactFactory'], ['box2d.CircleContact', 'box2d.PolyAndCircleContact', 'box2d.PolyContact', 'box2d.Shape']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2ContactNode.js', ['box2d.ContactNode'], []);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2ContactRegister.js', ['box2d.ContactRegister'], []);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2ContactSolver.js', ['box2d.ContactSolver'], ['box2d.ContactConstraint', 'box2d.Settings']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2NullContact.js', ['box2d.NullContact'], ['box2d.Contact', 'box2d.ContactNode']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2PolyAndCircleContact.js', ['box2d.PolyAndCircleContact'], ['box2d.CircleShape', 'box2d.Contact', 'box2d.ContactNode', 'box2d.Manifold', 'box2d.PolyShape']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/contacts/b2PolyContact.js', ['box2d.PolyContact'], ['box2d.ContactNode', 'box2d.Manifold', 'box2d.Math', 'box2d.PolyShape']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2DistanceJoint.js', ['box2d.DistanceJoint'], ['box2d.DistanceJointDef', 'box2d.Joint']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2DistanceJointDef.js', ['box2d.DistanceJointDef'], ['box2d.JointDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2GearJoint.js', ['box2d.GearJoint'], ['box2d.GearJointDef', 'box2d.Joint']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2GearJointDef.js', ['box2d.GearJointDef'], ['box2d.JointDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2Jacobian.js', ['box2d.Jacobian'], ['box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2Joint.js', ['box2d.Joint'], ['box2d.JointNode']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2JointDef.js', ['box2d.JointDef'], ['box2d.Joint']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2JointFactory.js', ['box2d.JointFactory'], ['box2d.DistanceJoint', 'box2d.GearJoint', 'box2d.MouseJoint', 'box2d.PrismaticJoint', 'box2d.PulleyJoint', 'box2d.RevoluteJoint']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2JointNode.js', ['box2d.JointNode'], []);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2MouseJoint.js', ['box2d.MouseJoint'], ['box2d.Joint', 'box2d.MouseJointDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2MouseJointDef.js', ['box2d.MouseJointDef'], ['box2d.JointDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2PrismaticJoint.js', ['box2d.PrismaticJoint'], ['box2d.Jacobian', 'box2d.Joint', 'box2d.PrismaticJointDef', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2PrismaticJointDef.js', ['box2d.PrismaticJointDef'], ['box2d.JointDef', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2PulleyJoint.js', ['box2d.PulleyJoint'], ['box2d.Joint', 'box2d.PulleyJointDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2PulleyJointDef.js', ['box2d.PulleyJointDef'], ['box2d.JointDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2RevoluteJoint.js', ['box2d.RevoluteJoint'], ['box2d.Joint', 'box2d.RevoluteJointDef']);
goog.addDependency('../../../js/engine/libs/box2d/dynamics/joints/b2RevoluteJointDef.js', ['box2d.RevoluteJointDef'], ['box2d.Joint', 'box2d.JointDef', 'box2d.Vec2']);
goog.addDependency('../../../js/engine/network/channels/ichannel.js', ['CrunchJS.Network.Channel.IChannel'], []);
goog.addDependency('../../../js/engine/network/channels/webworker-channel.js', ['CrunchJS.Network.Channel.WebWorkerChannel'], ['CrunchJS.Network.Channel.IChannel', 'goog.array', 'goog.structs', 'goog.structs.Map', 'goog.structs.Set']);
goog.addDependency('../../../js/engine/network/remoteengines/AbstractRemoteEngine.js', ['CrunchJS.Network.RemoteEngine', 'CrunchJS.Network.RemoteEngine.AbstractRemoteEngine'], ['CrunchJS.Internal.EventManager']);
goog.addDependency('../../../js/engine/network/remoteengines/MainRemoteEngine.js', ['CrunchJS.Network.RemoteEngine.MainRemoteEngine'], ['CrunchJS.Network.Channel.WebWorkerChannel', 'CrunchJS.Network.RemoteEngine.TrustedRemoteEngine']);
goog.addDependency('../../../js/engine/network/remoteengines/TrustedRemoteEngine.js', ['CrunchJS.Network.RemoteEngine.TrustedRemoteEngine'], ['CrunchJS.Network.RemoteEngine.AbstractRemoteEngine']);
goog.addDependency('../../../js/engine/network/remoteengines/WWRemoteEngine.js', ['CrunchJS.Network.RemoteEngine.WWRemoteEngine'], ['CrunchJS.Network.Channel.WebWorkerChannel', 'CrunchJS.Network.RemoteEngine.TrustedRemoteEngine']);
goog.addDependency('../../../js/engine/utils/bitset.js', ['CrunchJS.Utils.BitSetOperator'], []);
goog.addDependency('../../../js/engine/utils/vendor.loader.js', ['CrunchJS.Utils.vendor'], []);
goog.addDependency('../../../js/game.js', ['game'], ['Moba']);
goog.addDependency('../../../js/game/components/examples/ExampleComp.js', ['Moba.ExampleComp'], ['CrunchJS.Component']);
goog.addDependency('../../../js/game/components/examples/ExampleComp1.js', ['Moba.ExampleComp1'], ['CrunchJS.Component']);
goog.addDependency('../../../js/game/core/core.js', ['Moba', 'Moba.Core'], ['CrunchJS', 'Moba.ExampleScene', 'box2d.World']);
goog.addDependency('../../../js/game/scenes/examples/ExampleScene.js', ['Moba.ExampleScene'], ['CrunchJS.Components.Body', 'CrunchJS.Components.Occupancy', 'CrunchJS.Components.OccupancyGrid', 'CrunchJS.Components.Transform', 'CrunchJS.Network.RemoteEngine.WWRemoteEngine', 'CrunchJS.Scene', 'Moba.ExampleComp', 'Moba.ExampleComp1', 'Moba.ExampleSystem', 'Moba.ExampleSystem1']);
goog.addDependency('../../../js/game/simulation/simulation-bootstrap.js', ['SimulationBootstrap'], ['Moba']);
goog.addDependency('../../../js/game/simulation/simulation.js', ['Simulation'], ['CrunchJS', 'CrunchJS.Network.Channel.WebWorkerChannel', 'Moba.ExampleScene', 'Moba.ExampleSystem', 'Moba.ExampleSystem1', 'SimulationConfig']);
goog.addDependency('../../../js/game/systems/example/ExampleSystem.js', ['Moba.ExampleSystem'], ['CrunchJS.System']);
goog.addDependency('../../../js/game/systems/example/ExampleSystem1.js', ['Moba.ExampleSystem1'], ['CrunchJS.System']);
goog.addDependency('../../../js/shared/simulation-config.js', ['SimulationConfig'], ['Moba.ExampleSystem']);
goog.addDependency('app/js/game.js', ['game'], ['Moba']);
