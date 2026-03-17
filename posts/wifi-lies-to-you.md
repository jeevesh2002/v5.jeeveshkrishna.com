---
title: "Your Wi-Fi did not forget your password"
date: "2026-01-14"
tags: ["Networking", "Security", "Wi-Fi"]
excerpt: "I typed the same password twice. Second time it worked. That made no sense, so I kept asking why."
published: false
---

There is a specific moment where this happens. Your Wi-Fi goes out - router hiccup, whatever - and comes back up a few seconds later. You see the network appear on your phone and you tap connect immediately. It says incorrect password. Same network you have been on for years. You type the same password again, or just tap connect again, and it works.

That should not be possible. The password did not change in those two seconds. So what actually failed?

My first instinct was something vague like the network was "unstable." But that explanation collapsed immediately when I pressed it. Unstable how? The router was fine. I was standing in the same spot. The signal was visible. If the network was there and the password was correct, what exactly went wrong?

Turns out the password was never the issue. When you connect to Wi-Fi it is not a single step - it is a sequence. [802.11](https://en.wikipedia.org/wiki/IEEE_802.11) association first, then security authentication, then key derivation, and only after all of that does your device get an IP address. Your traffic does not move until every step succeeds. The "wrong password" error almost never comes from the password check. It comes from key negotiation, several frames deep into the [WPA four-way handshake](https://en.wikipedia.org/wiki/Wi-Fi_Protected_Access#The_four-way_handshake).

So what is the WPA handshake actually doing? I assumed it was verifying the password - checking that you know the secret. But that is not it. It is using your password as a seed to generate fresh encryption keys for this session, mixed with random numbers from both sides and their MAC addresses. The keys are unique every time, which means even if someone recorded all your traffic and later got your password, they still could not decrypt it. Your password stays the same. The handshake generates something new from it each time.

Those handshake messages are just radio frames. And radio is noisy. One corrupted frame - interference from a nearby network, a microwave, anything - and the handshake fails. That exact moment when Wi-Fi comes back and you connect immediately is the worst moment to try, because the channel is often still settling. The retry works because the interference passed. The device never learned the actual reason. It just saw: handshake did not complete. So it told you the nearest thing it knew how to say: wrong password.

The device knew more than it told you and it chose the simpler message.

This raised another question - how often does this handshake have to happen? Every new connection. Every reconnect after a drop. Periodically every hour or so for re-keying, though that usually happens invisibly. And every time a device roams between access points, which in a large building can be constantly.

That last one becomes a real problem at scale. Each roam triggers full re-authentication, adding 100 to 300ms per transition. On a VoIP call that gap is audible. There is a protocol called [802.11r](https://en.wikipedia.org/wiki/IEEE_802.11r-2008) that addresses this by pre-distributing key material across access points, so a roaming device completes the handshake in milliseconds instead of going through the whole process again. Home networks never need it. Hospitals and warehouses depend on it.

What stayed with me is not the technical mechanism. It is that the error message was a design decision. The OS had the real failure reason. It chose not to tell you. Most of the time that is fine - most people do not want the actual reason. But when the simplified version trains you to doubt a correct password, the simplification is working against you.
