## slide- an experiment in WebGL and cannon.js physics

Slide uses Three.js for scene rendering and Cannon.js for physics with Physijs as a wrapper.
The physics simulation runs as a web worker. This prevents blocking of the rendering thread.

###The goal

Slide will eventually be a sandbox with FPS elements. I am focusing on building a unique driving experience (hence the name) by a highly extensible vehicle system. All vehicles will leverage raycasting to better simulate suspension and traction. 


###On the to-do list

Either figure out how to extend Physijs modularly or fork it and include it as a submodule. Currently all libs are being included in this repo and are being modified directly (for lack of a better immediate solution).