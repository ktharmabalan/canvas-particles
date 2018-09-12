const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomColor = (colors) => {
  return colors[Math.floor(Math.random() * colors.length)]
}

const distance = (x1, y1, x2, y2) => {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

const rotate = (particle, angle) => {
  const { dx, dy } = particle;
  const rotatedVelocities = {
    dx: dx * Math.cos(angle) - dy * Math.sin(angle),
    dy: dx * Math.sin(angle) + dy * Math.cos(angle)
  };

  return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

const resolveCollision = (particle, otherParticle) => {
  const xVelocityDiff = particle.dx - otherParticle.dx;
  const yVelocityDiff = particle.dy - otherParticle.dy;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // Grab angle between the two colliding particles
    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const { dx, dy } = rotate(particle, angle);
    const { dx: dx1, dy: dy1 } = rotate(otherParticle, angle);

    // Velocity after 1d collision equation
    const v1 = {
      dx: dx * (m1 - m2) / (m1 + m2) + dx1 * 2 * m2 / (m1 + m2),
      dy: dy
    };
    const v2 = {
      dx: dx1 * (m1 - m2) / (m1 + m2) + dx * 2 * m2 / (m1 + m2),
      dy: dy1
    };

    // Final velocity after rotating axis back to original location
    const { dx: vx, dy: vy } = rotate(v1, -angle);
    const { dx: vx1, dy: vy1 } = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.dx = vx;
    particle.dy = vy;

    otherParticle.dx = vx1;
    otherParticle.dy = vy1;
  }
}

module.exports = {
  resolveCollision,
  randomIntFromRange,
  randomColor,
  distance
}