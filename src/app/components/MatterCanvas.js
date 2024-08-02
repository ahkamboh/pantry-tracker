"use client"
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import MatterWrap from 'matter-wrap';
import MatterAttractors from 'matter-attractors';

const MatterScene = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    Matter.use(MatterWrap);
    Matter.use(MatterAttractors);

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      World,
      Body,
      Mouse,
      Events,
      Common
    } = Matter;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Create world
    const world = engine.world;
    world.gravity.y = 0;
    world.gravity.x = 0;
    world.gravity.scale = 0.1;

    // Create attractive body
    const attractiveBody = Bodies.circle(
      render.options.width / 2,
      render.options.height / 2,
      Math.max(render.options.width / 25, render.options.height / 25) / 2,
      {
        render: {
          fillStyle: '#000',
          strokeStyle: '#000',
          lineWidth: 0,
        },
        isStatic: true,
        plugin: {
          attractors: [
            (bodyA, bodyB) => ({
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            }),
          ],
        },
      }
    );

    World.add(world, attractiveBody);

    // Create bodies
    for (let i = 0; i < 60; i++) {
      const x = Common.random(0, render.options.width);
      const y = Common.random(0, render.options.height);
      const s = Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
      const polygonNumber = Common.random(3, 6);

      const body = Bodies.polygon(x, y, polygonNumber, s, {
        mass: s / 20,
        friction: 0,
        frictionAir: 0.02,
        angle: Math.round(Math.random() * 360),
        render: {
          fillStyle: '#222222',
          strokeStyle: '#000000',
          lineWidth: 2,
        },
      });

      World.add(world, body);

      const r = Common.random(0, 1);

      [
        { radius: Common.random(2, 8), options: {
          mass: 0.1,
          friction: 0,
          frictionAir: 0.01,
          render: {
            fillStyle: r > 0.3 ? '#27292d' : '#444444',
            strokeStyle: '#000000',
            lineWidth: 2,
          },
        }},
        { radius: Common.random(2, 20), options: {
          mass: 6,
          friction: 0,
          frictionAir: 0,
          render: {
            fillStyle: r > 0.3 ? '#334443' : '#222222',
            strokeStyle: '#111111',
            lineWidth: 4,
          },
        }},
        { radius: Common.random(2, 30), options: {
          mass: 0.2,
          friction: 0.6,
          frictionAir: 0.8,
          render: {
            fillStyle: '#191919',
            strokeStyle: '#111111',
            lineWidth: 3,
          },
        }},
      ].forEach(({ radius, options }) => {
        const circle = Bodies.circle(x, y, radius, options);
        World.add(world, circle);
      });
    }

    // Add mouse control
    const mouse = Mouse.create(render.canvas);

    Events.on(engine, 'afterUpdate', () => {
      if (!mouse.position.x) return;
      Body.translate(attractiveBody, {
        x: (mouse.position.x - attractiveBody.position.x) * 0.12,
        y: (mouse.position.y - attractiveBody.position.y) * 0.12,
      });
    });

    // Run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef} style={{ width: '100%', height: '100vh' }} />;
};

export default MatterScene;