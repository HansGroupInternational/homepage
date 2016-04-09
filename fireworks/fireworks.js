var focused = true;

window.onfocus = function() {
    focused = true;
};
window.onblur = function() {
    focused = false;
};

GRAVITY = 2.6/60; // 2px/second gravity

TYPES = {};
TYPES.random_test = function(){
  return {
    x: Math.random()*800,
    vector: [Math.random()*((Math.random()>.5)*-1)*4, Math.random()*4+5],
    trail_width: 3,
    trail_color: "red",
    explosion_delay: 60*3.6*Math.random()+2,
    tick: 0,
    mass: 250,
    child_fireworks: {
      number: 30,
      vector_generator: function(n, child_n){ // n = total children fireworks; child_n is the index of current child firework
        rads = ((2*Math.PI)/n)*child_n;
        //console.log([Math.sin(rads), Math.cos(rads)])
        if(child_n%2 == 0){
          return [Math.sin(rads)*.75, Math.cos(rads)*.75];
        }else{
          return [Math.sin(rads)*.5, Math.cos(rads)*.5];
        }
      },
      child_generator: function(n, vector, position){
        return TYPES.random_test_ember(vector, position);
      }
    },
    trail: {
      number: 2,
      vector_generator: function(n, child_n){ // n = total children fireworks; child_n is the index of current child firework
        rads = ((2*Math.PI)/n)*child_n;
        //console.log([Math.sin(rads), Math.cos(rads)])
        if(child_n%2 == 0){
          return [(Math.random()*-1)/5, 0];
        }else{
          return [(Math.random()*1)/5, 0];
        }
      },
      trail_generator: function(position, tick, width, vector, parent_vector){
        position._x += parent_vector[0] * 1+(parent_vector[0]/width/2);
        position._y += parent_vector[1] * 1+(parent_vector[0]/width/2);
        if(tick%2 == 0){
          return TYPES.random_test_trail([(((Math.random()*2)-1)/4.5), Math.random()*-1], position);
        }else{
          return false;
        }
      }
    }
  }
}
TYPES.random_test_ember = function(vector, position){
  return {
    position: position,
    vector: vector,
    trail_width: 1.5,
    trail_color: "purple",
    explosion_delay: 60*Math.random()+(60),
    tick: 0,
    mass: 25,
    color_generator: function(fillColor, strokeColor){
      fillColor.hue += 10;
      strokeColor.hue += 10;
      return [fillColor, strokeColor];
    }
  }
}
TYPES.random_test_trail = function(vector, position){
  return {
    position: position,
    vector: vector,
    trail_width: .25,
    trail_color: "gold",
    explosion_delay: 30,
    tick: 0,
    mass: 25
    /*color_generator: function(fillColor, strokeColor){
      fillColor.hue += 10;
      strokeColor.hue += 10;
      return [fillColor, strokeColor];
    }*/
  }
}

//properties = {x, vector, mass, trail_width, trail_color, explosion_color, child_amount, child_velocity, child_vector(s)?, explosion_delay}
function spawn_firework(properties){
  firework = new Path.Circle(new Point(properties.x,view.bounds.height - properties.trail_width - 5), properties.trail_width);
  firework.style = {
    strokeColor: properties.trail_color,
    fillColor: properties.trail_color
  };
  firework.set(properties);
}

function step_firework(firework, j){
  firework.vector[1] = firework.vector[1] - (GRAVITY*firework.mass*.0055);
  firework.position.x = firework.position.x - firework.vector[0]
  firework.position.y = firework.position.y - firework.vector[1];
  if(firework.position.y  > view.size.height){
    firework.remove()
  }
  //console.log(typeof(firework.color_generator));
  if(typeof(firework.color_generator) == "function"){
    color_mod = firework.color_generator(firework.fillColor, firework.strokeColor);
    firework.fillColor = color_mod[0];
    firework.strokeColor = color_mod[1];
  }
  if(typeof(firework.trail) == "object"){
    if(firework.trail.trail_generator(firework.position, firework.tick, firework.trail_width, firework.trail.vector_generator(firework.trail.number, k), firework.vector)){
      for(var k = 0; k < firework.trail.number; k++){
        spawn_firework(firework.trail.trail_generator(firework.position, firework.tick, firework.trail_width, firework.trail.vector_generator(firework.trail.number, k), firework.vector));
      }
    }
  }
  firework.tick++;
  if(firework.tick >= firework.explosion_delay){
    if(firework.child_fireworks){
      for(var l = 0; l < firework.child_fireworks.number; l++){
        if(firework.child_fireworks.child_generator(l, firework.child_fireworks.vector_generator(firework.child_fireworks.number, l), firework.position)){
          spawn_firework(firework.child_fireworks.child_generator(l, firework.child_fireworks.vector_generator(firework.child_fireworks.number, l), firework.position));
        }
      }
    }
    firework.remove()
  }
}

function onFrame(event){
  for(var j = 0; j < project.activeLayer.children.length; j++){
    step_firework(project.activeLayer.children[j], j);
  }
}

function random_spawner(){
  if(focused){
    spawn_firework(TYPES.random_test());
  }
  setTimeout(function(){
    random_spawner();
  }, 750);
}

// MAIN
random_spawner();
