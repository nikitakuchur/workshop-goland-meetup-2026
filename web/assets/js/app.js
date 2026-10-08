// Spotted!'s effects: particle explosions on a canvas over the page (on any
// click, on load in the hero, and as cards pop in), counting stats, and a
// tilt on cards under the pointer. With reduced motion none of it runs, and
// the CSS shows everything as it is.

(function () {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const COLOURS = ['#7c3aed', '#ec4899', '#f97316', '#06b6d4', '#facc15', '#be185d'];
	const MAX_PARTICLES = 1600;

	const canvas = document.createElement('canvas');
	canvas.className = 'fx';
	canvas.setAttribute('aria-hidden', 'true');
	document.body.appendChild(canvas);
	const ctx = canvas.getContext('2d');

	let particles = [];
	let rings = [];
	let running = false;
	let last = 0;

	function resize() {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.round(window.innerWidth * dpr);
		canvas.height = Math.round(window.innerHeight * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	resize();
	window.addEventListener('resize', resize, { passive: true });

	const rand = (min, max) => min + Math.random() * (max - min);
	const pick = (list) => list[Math.floor(Math.random() * list.length)];

	// burst throws particles out from x, y; power scales their number, speed and size.
	function burst(x, y, power = 1, withRing = true) {
		const room = MAX_PARTICLES - particles.length;
		const n = Math.min(room, Math.round(70 * power));
		for (let i = 0; i < n; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = rand(1.5, 9) * Math.sqrt(power);
			const roll = Math.random();
			particles.push({
				x, y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - rand(0, 2),
				life: 0,
				max: rand(40, 85),
				size: rand(2, 5) * Math.max(power, 0.6),
				colour: pick(COLOURS),
				kind: roll < 0.35 ? 'confetti' : roll < 0.7 ? 'streak' : 'dot',
				rot: Math.random() * Math.PI,
				spin: rand(-0.3, 0.3),
			});
		}
		if (withRing) {
			rings.push({ x, y, life: 0, max: 30, radius: 90 * power, colour: pick(COLOURS) });
		}
		if (!running) {
			running = true;
			last = 0;
			requestAnimationFrame(frame);
		}
	}

	function frame(now) {
		// rAF's timestamp can be earlier than when the burst started, so the step never goes below zero.
		const dt = last ? Math.min(Math.max((now - last) / 16.67, 0), 3) : 1;
		last = now;
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		rings = rings.filter((r) => {
			r.life += dt;
			const t = r.life / r.max;
			if (t >= 1) return false;
			const ease = 1 - Math.pow(1 - t, 3);
			ctx.globalAlpha = (1 - t) * 0.9;
			if (t < 0.25) {
				const flash = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.radius * 0.6);
				flash.addColorStop(0, 'rgba(255, 250, 220, 1)');
				flash.addColorStop(0.4, 'rgba(250, 204, 21, 0.6)');
				flash.addColorStop(1, 'rgba(249, 115, 22, 0)');
				ctx.fillStyle = flash;
				ctx.beginPath();
				ctx.arc(r.x, r.y, Math.max(0, r.radius * 0.6 * (0.5 + ease)), 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.strokeStyle = r.colour;
			ctx.lineWidth = Math.max(0.5, 8 * (1 - t));
			ctx.beginPath();
			ctx.arc(r.x, r.y, Math.max(0, r.radius * ease), 0, Math.PI * 2);
			ctx.stroke();
			return true;
		});

		particles = particles.filter((p) => {
			p.life += dt;
			if (p.life >= p.max) return false;
			const drag = Math.pow(0.95, dt);
			p.vx *= drag;
			p.vy = p.vy * drag + 0.14 * dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.rot += p.spin * dt;

			ctx.globalAlpha = 1 - p.life / p.max;
			ctx.fillStyle = p.colour;
			ctx.strokeStyle = p.colour;
			if (p.kind === 'confetti') {
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				ctx.fillRect(-p.size, -p.size / 2.5, p.size * 2, p.size / 1.25);
				ctx.restore();
			} else if (p.kind === 'streak') {
				ctx.lineWidth = p.size / 2;
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.arc(p.x, p.y, Math.max(0, p.size / 1.5), 0, Math.PI * 2);
				ctx.fill();
			}
			return true;
		});

		ctx.globalAlpha = 1;
		if (particles.length || rings.length) {
			requestAnimationFrame(frame);
		} else {
			running = false;
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		}
	}

	// Any click explodes where it landed; a keyboard "click" has no position, so it uses the element's centre.
	document.addEventListener('click', (e) => {
		let x = e.clientX;
		let y = e.clientY;
		if (e.detail === 0 && e.target instanceof Element) {
			const r = e.target.getBoundingClientRect();
			x = r.left + r.width / 2;
			y = r.top + r.height / 2;
		}
		burst(x, y, 1);
	});

	// The hero's title lands, the hero shakes and three bursts go off around it.
	const title = document.querySelector('[data-boom]');
	if (title) {
		const hero = title.closest('.hero');
		window.setTimeout(() => {
			const r = title.getBoundingClientRect();
			if (r.bottom < 0 || r.top > window.innerHeight) return;
			const cx = r.left + r.width / 2;
			const cy = r.top + r.height / 2;
			burst(cx, cy, 2.2);
			window.setTimeout(() => burst(r.left + r.width * 0.15, cy - r.height * 0.2, 1.1), 160);
			window.setTimeout(() => burst(r.right - r.width * 0.15, cy + r.height * 0.1, 1.1), 300);
			if (hero) {
				hero.classList.add('is-shaking');
				hero.addEventListener('animationend', (e) => {
					if (e.target === hero) hero.classList.remove('is-shaking');
				});
			}
		}, 480);
	}

	// Stats count up from zero, then settle on the server's text.
	document.querySelectorAll('[data-count]').forEach((el) => {
		const target = Number(el.dataset.count);
		const text = el.textContent;
		if (!Number.isFinite(target) || target <= 0) return;
		const start = performance.now() + 600;
		const duration = 1400;
		el.textContent = '0';
		function tick(now) {
			const t = Math.min(Math.max((now - start) / duration, 0), 1);
			const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
			el.textContent = t === 1 ? text : Math.round(target * eased).toLocaleString('en-GB');
			if (t < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	});

	// Cards and headings pop in as they scroll into view, the first few of each batch with a spark.
	const observer = new IntersectionObserver((entries) => {
		let shown = 0;
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			const el = entry.target;
			observer.unobserve(el);
			const delay = Math.min(shown, 6) * 70;
			el.style.setProperty('--pop-delay', delay + 'ms');
			el.classList.add('is-in');
			if ('spark' in el.dataset && shown < 4) {
				window.setTimeout(() => {
					const r = el.getBoundingClientRect();
					if (r.bottom < 0 || r.top > window.innerHeight) return;
					burst(r.left + r.width / 2, r.top + Math.min(r.height / 2, 160), 0.45, false);
				}, delay + 380);
			}
			shown++;
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
	document.querySelectorAll('.pop').forEach((el) => observer.observe(el));

	// Cards tilt towards the pointer, with a glare following it.
	if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
		let active = null;
		let px = 0;
		let py = 0;
		let pending = 0;

		const reset = (card) => {
			card.style.removeProperty('--rx');
			card.style.removeProperty('--ry');
			card.style.removeProperty('--mx');
			card.style.removeProperty('--my');
		};

		document.addEventListener('pointermove', (e) => {
			const card = e.target instanceof Element ? e.target.closest('.card') : null;
			if (card !== active) {
				if (active) reset(active);
				active = card;
			}
			if (!card) return;
			px = e.clientX;
			py = e.clientY;
			if (pending) return;
			pending = requestAnimationFrame(() => {
				pending = 0;
				if (!active) return;
				const r = active.getBoundingClientRect();
				const dx = (px - r.left) / r.width - 0.5;
				const dy = (py - r.top) / r.height - 0.5;
				active.style.setProperty('--ry', (dx * 10).toFixed(2) + 'deg');
				active.style.setProperty('--rx', (-dy * 10).toFixed(2) + 'deg');
				active.style.setProperty('--mx', ((dx + 0.5) * 100).toFixed(1) + '%');
				active.style.setProperty('--my', ((dy + 0.5) * 100).toFixed(1) + '%');
			});
		}, { passive: true });

		document.documentElement.addEventListener('mouseleave', () => {
			if (active) reset(active);
			active = null;
		});
	}
})();
