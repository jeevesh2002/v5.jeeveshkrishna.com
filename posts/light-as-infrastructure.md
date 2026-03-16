---
title: "What if we just used light instead"
date: "2026-03-15"
tags: ["Networking", "Optics", "Infrastructure", "Li-Fi"]
excerpt: "I started wondering whether you could skip radio entirely and just transmit data through light. Turns out you can. The reason it has not replaced Wi-Fi is more interesting than I expected."
published: false
---

After going deep on how Wi-Fi actually works I started wondering - why radio at all? Radio waves, spectrum congestion, interference from microwaves and neighbors. Is there something else? What about light? Can you just use light to transmit data wirelessly?

Turns out yes. It is called [Li-Fi](https://en.wikipedia.org/wiki/Li-Fi) and the physics is real. An LED is not just on or off - you can vary the current driving it at extremely high frequencies, well into the GHz range. The light intensity flickers but far faster than any human eye can detect. Your eye integrates over roughly 60Hz. The modulation runs millions of times faster than that. A photodiode at the receiver captures those intensity variations and converts them back into an electrical signal. That signal carries your data. Lab speeds have hit multi-Gbps.

My immediate next question was about interference. An office has dozens of lights. Sunlight comes through windows. Voltage fluctuates. Won't all of that corrupt the signal?

No, and the reason is specific. Ambient light - your desk lamp, sunlight - produces essentially DC illumination. It barely varies. The Li-Fi receiver is tuned to detect rapid modulations at a specific carrier frequency, not slow variation. It is like listening for a very high-pitched tone in a room with low background noise. The background noise is there but at a completely different frequency, so it gets filtered out. The Li-Fi signal is what stands out.

So the physics is solid. Then why is it not everywhere?

Line of sight. Light does not go through walls. If something comes between the emitter and the receiver - your hand, your body, a piece of furniture - the connection drops. This kills the entire use case I had in mind, which was using it the same way I use Wi-Fi now, walking around with my phone. You would have to point yourself toward the sensor every time you wanted to use it. That is not a product, that is a chore.

Where it does make sense is fixed installations. A sensor with a clear sightline to a ceiling emitter. A desktop in a secure facility where radio emissions are a security concern - there are real deployments in environments where RF is simply not allowed. Anything that does not move. For those cases, Li-Fi is genuinely good.

I kept thinking and landed on a different use - what if you used light beams not to replace Wi-Fi but to carry traffic between fixed points, feeding a normal Wi-Fi network at the end? Like a backbone. Turns out this already exists and has for decades. It is called [Free Space Optics](https://en.wikipedia.org/wiki/Free-space_optical_communication), FSO, and telecom companies actually use it.

The use cases are things like: connecting two buildings across a river where you cannot trench fiber, setting up a temporary high-bandwidth link quickly when a fiber line goes down, reaching remote areas where physical infrastructure would take months to install. [Project Taara](https://x.company/projects/taara/) by Alphabet's X built exactly this - FSO links capable of 20 Gbps across the Congo River, connecting Brazzaville and Kinshasa where laying fiber was not practical.

There is even a small physics reason why lasers beat fiber on latency. Light through glass slows down because the refractive index of silica is about 1.5, meaning it travels at roughly two-thirds of c. Light through air is close to full speed. Over 20 kilometers that is a few microseconds difference - irrelevant for almost everything, relevant for high-frequency trading.

But fiber wins in almost every other way. Fog scatters the laser beam badly. Heavy rain attenuates it. A bird flying through at the wrong moment causes a dropout. Fiber just does not have weather problems. And fiber bandwidth has kept growing through better optics on the same cables, so the reliability gap has grown, not shrunk.

I was also thinking about portable FSO for disaster scenarios - someone carries a compact unit in a backpack, deploys it on a hill, establishes a multi-kilometer link. The physics allows it. The hard problem is alignment. A narrow laser beam needs to be pointed with arcsecond accuracy. On a stable automated mount that is manageable. In a disaster zone, under pressure, without specialized equipment, that falls apart fast.

Which is why radios still run disaster response. They are omnidirectional - you do not aim them, you just turn them on. They work in chaos. They tolerate misalignment because there is no alignment to maintain. Every time I looked at pushing toward higher bandwidth in wireless the same tradeoff appeared: more bandwidth requires more directionality, and more directionality means less tolerance for real-world mess. In a disaster you almost always want the forgiving option, not the fast one.
