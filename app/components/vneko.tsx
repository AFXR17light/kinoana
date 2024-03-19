"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import Image from 'next/image';
import { useNekoState } from './context';
import confetti from 'canvas-confetti';
import calendar from 'js-calendar-converter';

import { calendarEvent } from '../types'
import partyhat from '../images/partyhat.png';
import knithat from '../images/knithat.png';

const ENV = process.env.NODE_ENV;
const devmode = false;

const Vneko = () => {
    const [devmodeDisplay, setDevmodeDisplay] = useState(true);
    const [devTrack, setDevTrack] = useState(false);

    function randInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function nextMonth() {
        const nextmonth = new Date();
        nextmonth.setMonth(nextmonth.getMonth() + 1);
        return nextmonth;
    }

    const [cookies, setCookie] = useCookies(['neko']);

    if (!cookies.neko) {
        setCookie('neko', 'true', { path: '/', expires: nextMonth(), secure: true, sameSite: 'none' });
    }

    const neko_normal = `
  /\\_/\\
(  o.o  )
    `;
    const neko_happy = `
  /\\_/\\
(  ^-^  )
    `;
    const neko_sad = `
  /\\_/\\
(  T.T  )
    `;
    const neko_eyeshut = `
  /\\_/\\
(  >.<  )
    `;
    const neko_surprised = `
  /\\_/\\
(  O.O  )
    `;
    const neko_eyeclosed = `
  /\\_/\\
(  -.-  )
    `;
    const neko_confused = `
  /\\_/\\
(  o.O  )
    `;
    const neko_dizzy = `
  /\\_/\\
(  @.@  )
        `
    const neko_hide = `
  /\\ /\\
    `;
    let currentFx: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined = null;
    const events: Record<string, calendarEvent> = { // priority: bottom to top
        // seasons //
        "Spring": {
            "start": "02-01",
            "end": "06-01",
            "hat": ["🌱", "🌱", "🌱", "🌼", "🌸", "🍀", "🍀"]
        },
        "Summer": {
            "start": "06-01",
            "end": "09-01",
            "hat": ["🌴", "🌴", "🌴", "🪷", "🌻", "🌻", "🐚", "👒", "👒"]
        },
        "Autumn": {
            "start": "09-01",
            "end": "12-01",
            "hat": ["🍊", "🍊", "🍊", "🍂", "🍁", "🌾", "🌽", "☕"]
        },
        "Winter": {
            "start": "12-01",
            "end": "02-01",
            "hat": [<Image key={'winter-hat'} src={knithat} alt="knit hat" style={{ width: "1em", height: ".8em" }} />,
                "☃️", "❄", "🧣", "🍲"
            ],
        },
        // solar terms //
        "vernal equinox": {
            "start": "03-20",
            "end": "03-21",
            "hat": "🌸"
        },
        "summer solstice": {
            "start": "06-20",
            "end": "06-21",
            "hat": "🎐"
        },
        "autumnal equinox": {
            "start": "09-22",
            "end": "09-23",
            "hat": "🌾"
        },
        "winter solstice": {
            "start": "12-21",
            "end": "12-22",
            "hat": "🍲"
        },
        // festivals //
        "NewYear": {
            "start": "01-01",
            "end": "01-02",
            "hat": [<Image key={'partyhat'} src={partyhat} alt="partyhat" style={{ width: "1em", height: "1em" }} />],
        },
        "CNY": {
            "lunar": true,
            "start": "01-01",
            "end": "01-8",
            "hat": "🧧"
        },
        "Valentine": {
            "start": "02-14",
            "end": "02-15",
            "hat": "💖"
        },
        "lantern": {
            "lunar": true,
            "start": "01-15",
            "end": "01-16",
            "hat": "🏮"
        },
        "Easter": {
            "start": "04-04",
            "end": "04-05",
            "hat": "🐰"
        },
        "MayDay": {
            "start": "05-01",
            "end": "05-02",
            "hat": "🌷"
        },
        "Mother": { // second sunday of May
            "start": "05-12",
            "end": "05-13",
            "hat": "🌹"
        },
        "Father": { // third sunday of June
            "start": "06-16",
            "end": "06-17",
            "hat": "🌻"
        },
        "DragonBoat": {
            "lunar": true,
            "start": "05-05",
            "end": "05-06",
            "hat": "🍶"
        },
        "MidAutumn": {
            "lunar": true,
            "start": "08-15",
            "end": "08-16",
            "hat": "🥮"
        },
        "Halloween": {
            "start": "10-31",
            "end": "11-01",
            "hat": "🎃"
        },
        "Thanksgiving": {
            "start": "11-26",
            "end": "11-27",
            "hat": "🦃"
        },
        "Xmas": {
            "start": "12-25",
            "end": "12-26",
            "hat": "🎄"
        },
        // special
        "Anniversary": {
            "start": "02-16",
            "end": "02-19",
            "hat": [<Image key={'partyhat'} src={partyhat} alt="party hat" style={{ width: "1em", height: "1em" }} />],
            "fx": "ballons"
        },
        "test": {
            "start": "01-01",
            "end": "12-31",
            "hat": ""
        },
        "test2": {
            "lunar": true,
            "start": "02-24",
            "end": "02-25",
            "hat": "",
        }
    };
    const currentTime = new Date();
    const checkEvents = () => {
        let checkedEvents = [];
        for (const event of Object.values(events)) {
            const startMonthDay = event.start;
            const endMonthDay = event.end;
            const currentYear = currentTime.getFullYear();
            let startDate, endDate;
            if (event.lunar) {
                const lunarDate = calendar.lunar2solar(currentYear, parseInt(startMonthDay.split('-')[0]), parseInt(startMonthDay.split('-')[1]));
                startDate = new Date(`${currentYear}-${lunarDate.cMonth}-${lunarDate.cDay}`);
                const lunarDate2 = calendar.lunar2solar(currentYear, parseInt(endMonthDay.split('-')[0]), parseInt(endMonthDay.split('-')[1]));
                endDate = new Date(`${currentYear}-${lunarDate2.cMonth}-${lunarDate2.cDay}`);
            } else {
                startDate = new Date(`${currentYear}-${startMonthDay}`);
                endDate = new Date(`${currentYear}-${endMonthDay}`);
            }
            if (currentTime >= startDate && currentTime <= endDate) {
                checkedEvents.push(Object.keys(events).find(key => events[key] === event));
                if (event.hat) {
                    const type = typeof (event.hat);
                    const length = event.hat.length;
                    if (type === 'string') nekoHatRef.current = event.hat;
                    else nekoHatRef.current = event.hat[randInt(0, length - 1)];
                };
                if (event.fx) currentFx = event.fx;
            }
        }
        return checkedEvents;
    }

    const [balloonsArray, setBallonsArray] = useState([]);
    const balloonCount = useRef(0);
    const balloonsCooldownRef = useRef(false);
    const balloonsTimeoutRef = useRef(null);

    const [hide, setHide] = useState(false);
    const [neko, setNeko] = useState(neko_normal);
    const constNeko = neko_normal;
    const lastWhiskerRef = useRef(null);

    const gravity = 0.007;
    const elasticity = 0.3;
    const friction = 0.02;

    const { positionRef, velocityRef, nekoRef, nekoHatRef, login } = useNekoState();
    // original code:
    // const nekoRef = useRef(null);
    // const positionRef = useRef({ x: randInt(0, typeof window === 'undefined' ? 0 : (window.innerWidth - 100)), y: 0 });
    // const velocityRef = useRef({ x: 0, y: 0 });
    // const nekoHatRef = useRef('');
    const nekoWidthRef = useRef(null);
    const nekoHeightRef = useRef(null);
    const previousTimestampRef = useRef(null);
    const lastpositionRef = useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
    const [velocityRec, setVelocityRec] = useState({ x: 0, y: 0 });
    const touchingRef = useRef(false);
    const touchPositionRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);

    const handleTap = () => {
        // Handle tap interaction
        if (hide || neko === neko_eyeshut) return;
        // hide
        if (randInt(0, 100) > 66) {
            setHide(true);
            // Hide for random time
            setTimeout(() => {
                setHide(false);
                setNeko(constNeko);
            }, randInt(2000, 4000));
        } else {
            // eyeshut
            setNeko(neko_eyeshut);
            setTimeout(() => {
                setNeko(constNeko);
            }, 500);
        }
    };

    const handleDrag = (event: { preventDefault: () => void; type: string; clientX: number; clientY: number; changedTouches: { clientY: number; }[]; }) => {
        event.preventDefault();
        // Handle drag interaction
        if (hide || !touchingRef.current) return;
        if (event.type === 'mousemove') {
            positionRef.current = { x: event.clientX - nekoWidthRef.current / 2, y: (window.innerHeight - event.clientY) - nekoHeightRef.current / 2 };
        } else if (event.type === 'touchmove') {
            positionRef.current = { x: event.changedTouches[0].clientX - nekoWidthRef.current / 2, y: window.innerHeight - event.changedTouches[0].clientY - nekoHeightRef.current / 2 };
        }
    }

    const handleDragStart = () => {
        if (hide) return;
        // eyeshut
        setNeko(neko_eyeshut);
    }

    const handleDragEnd = () => {
        if (hide) return;
        // set velocity
        velocityRef.current = { x: velocityRec.x, y: velocityRec.y };
        setNeko(constNeko);
        setNeko(neko_dizzy);
        touchingRef.current = false;
        // eyeshut end
        setTimeout(() => {
            setHide(false);
            setNeko(constNeko);
        }, randInt(2000, 4000));
    }

    const handleMouseOutEnd = () => {
        if (hide) return;
        touchingRef.current = false;
    }

    let touchStartTimestamp: number;
    const handleTouchStart = (event: { clientX: number; clientY: number; }) => {
        if (hide) return;
        touchingRef.current = true;
        const nekoRect = nekoRef.current.getBoundingClientRect();
        touchPositionRef.current.x = event.clientX - nekoRect.left;
        touchPositionRef.current.y = event.clientY - (window.innerHeight - nekoRect.bottom);
        touchStartTimestamp = Date.now();
        // wait 200ms, if still touching, it's a drag
        setTimeout(() => {
            handleDragStart(event);
        }, 200);
    }

    const handleTouchEnd = (event: any) => {
        if (hide) return;
        touchingRef.current = false;
        const touchDuration = Date.now() - touchStartTimestamp;
        // if touch duration is less than 200ms, it's a tap
        if (touchDuration < 200) {
            handleTap();
        } else {
            handleDragEnd(event);
        }
    }

    const handleContact = (e: { target: { value: string; }; }) => {
        const content = e.target.value;
        lastWhiskerRef.current = content;
        if (content === 'confettis') confettis();
        if (content === 'balloon') createBalloon(positionRef.current.x, window.innerHeight);
        if (content === 'balloons') fullScreenBalloons();
        e.target.value = '';
    }

    const confettis = () => {
        if (!(nekoWidthRef.current && nekoHeightRef.current)) return;
        const ox = (positionRef.current.x + (nekoWidthRef.current / 2)) / window.innerWidth;
        const oy = (window.innerHeight - positionRef.current.y - nekoHeightRef.current) / window.innerHeight;
        let angle = 90;
        if (ox !== .5) { // prevent tan 90
            const tan = ((ox - .5) * window.innerWidth) / (oy * window.innerHeight);
            angle += (Math.atan(tan)) * (180 / Math.PI);
        }
        velocityRef.current.y += 0.36;
        confetti({
            origin: { x: ox, y: oy, },
            angle: angle
        });
    }

    const fullScreenBalloons = () => {
        if (balloonsCooldownRef.current) return;
        balloonsCooldownRef.current = true;
        setTimeout(() => {
            balloonsCooldownRef.current = false;
        }, 5000);
        let density = 0.036;
        if (window.innerWidth < 750) density = 0.05;
        const count = Math.round((window.innerWidth) * density);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = i / density;
                const y = window.innerHeight;
                createBalloon(x, y);
            }, randInt(0, 2500));
        }
    }

    const createBalloon = (x: number, y: number) => {
        if (balloonCount.current > 50) {
            return;
        }
        balloonsTimeoutRef.current && clearTimeout(balloonsTimeoutRef.current);
        const currentBalloonId = balloonCount.current++;
        const minSize = 75;
        const maxSize = 150;
        let size = randInt(minSize, maxSize);
        if (x < 0 || x > window.innerWidth - size) return;
        if (window.innerWidth < 750) size = randInt(minSize, maxSize / 1.5);
        const width = size;
        const height = 1.2 * size;
        const hue = randInt(0, 360);
        const saturation = randInt(60, 80);
        const brightness = randInt(50, 75);
        const bg = `linear-gradient(hsl(${hue}deg ${saturation}% ${brightness}% / 0.45), hsl(${hue}deg ${saturation + 10}% ${brightness - 20}% / 0.30))`;
        let wind = Math.random() - 0.5;
        let currentBalloon: HTMLElement | null;
        setTimeout(() => {
            currentBalloon = document.getElementById(`balloon${currentBalloonId}`);
            if (currentBalloon) setInterval(() => {
                if (!currentBalloon) return;
                currentBalloon.style.top = `${currentBalloon.offsetTop - size * 0.05}px`;
                currentBalloon.style.left = `${currentBalloon.offsetLeft + wind * 2.5}px`;
                if (currentBalloon.offsetLeft < 0 || currentBalloon.offsetLeft > window.innerWidth - size) wind = - wind;
                if (currentBalloon.offsetTop < - 1.8 * size) {
                    setBallonsArray(prevBalloons => {
                        return prevBalloons.filter((balloon) => balloon.id !== currentBalloonId);
                    });
                }
            }, 10);
            if (currentBalloon) setTimeout(() => {
                if (currentBalloon) currentBalloon.style.opacity = '0';
            }, 5000);
        }, 1);
        const newBallon = (
            // eslint-disable-next-line
            <div className='balloon' id={`balloon${currentBalloonId}`} key={`balloon${currentBalloonId}`}
                onClick={() => {
                    if (currentBalloon) {
                        currentBalloon.style.transition = "opacity .2s";
                        currentBalloon.style.opacity = '0';
                    };
                    setTimeout(() => {
                        setBallonsArray(prevBalloons => {
                            return prevBalloons.filter((balloon) => balloon.id !== currentBalloonId);
                        });
                    }, 200);
                }}
                style={{
                    position: "fixed",
                    left: x,
                    top: y,
                    transition: "opacity .5s",
                }}>
                {/* body */}
                <div style={{
                    width: width,
                    height: height,
                    borderRadius: "50% 50% 50% 50% / 45% 45% 55% 55%",
                    background: bg,
                }} />
                {/* highlight */}
                <div style={{
                    position: 'absolute',
                    width: '20%',
                    height: '30%',
                    top: '8%',
                    left: '16%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    transform: 'rotate(40deg)',
                }} />
                {/* handle */}
                <div style={{
                    position: 'absolute',
                    width: '1.5%',
                    height: `${randInt(40, 60)}%`,
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    background: 'rgba(200, 175, 100, 0.5)',
                }}>
                    {/* knot */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        height: '5%',
                        transform: 'translate(-50%, 0)',
                        borderRadius: '25% / 50%',
                        background: 'grey',
                        width: '500%',
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '5%',
                        left: '50%',
                        height: '5%',
                        transform: 'translate(-50%, 0)',
                        borderRadius: '25% / 50%',
                        background: bg,
                        width: '700%',
                    }} />
                </div>
            </div>
        )
        if (newBallon) setBallonsArray(prevBalloons => [...prevBalloons, {
            id: currentBalloonId,
            size: size,
            wind: wind,
            element: newBallon,
        }]);
        balloonsTimeoutRef.current = setTimeout(() => {
            setBallonsArray([]);
        }, 10000);
    }

    useEffect(() => {
        if (balloonsArray.length === 0) {
            balloonCount.current = 0;
        }
    }, [balloonsArray]);

    const updatePhysics = (timestamp: number | null) => {
        // -------------- //
        // Physics engine //
        // -------------- //
        if (!previousTimestampRef.current) previousTimestampRef.current = timestamp;
        const interval = (timestamp && previousTimestampRef.current) && timestamp - previousTimestampRef.current;
        if (!touchingRef.current) {
            // y
            if (positionRef.current.y > 0 && positionRef.current.y < window.innerHeight) {
                // Not on ground
                if (!interval) return;
                velocityRef.current = { x: velocityRef.current.x, y: velocityRef.current.y - gravity * interval };
            } else if (positionRef.current.y <= 0) { // Hit ground
                if (Math.abs(velocityRef.current.y) < 0.1) {
                    // Low speed, stay still
                    positionRef.current = { x: positionRef.current.x, y: 0 };
                    let velocityX = 0;
                    if (velocityRef.current.x > 0.01) {
                        velocityX = velocityRef.current.x - friction;
                    } else if (velocityRef.current.x < -0.01) {
                        velocityX = velocityRef.current.x + friction;
                    }
                    velocityRef.current = { x: velocityX, y: 0 };
                } else if (velocityRef.current.y < 0) {
                    // bounce
                    velocityRef.current = { x: velocityRef.current.x, y: -velocityRef.current.y * elasticity };
                }
            } else if (positionRef.current.y >= window.innerHeight) {
                // Hit ceiling
                if (velocityRef.current.y > 0) {
                    velocityRef.current = { x: velocityRef.current.x, y: -velocityRef.current.y * elasticity };
                }
                positionRef.current = { x: positionRef.current.x, y: window.innerHeight - 1 };
            }
            // x
            if (positionRef.current.x < 0) {
                // Hit left wall
                if (velocityRef.current.x < 0) {
                    velocityRef.current = { x: -velocityRef.current.x * elasticity, y: velocityRef.current.y };
                } else {
                    positionRef.current = { x: 0, y: positionRef.current.y };
                }
            } else if (nekoWidthRef.current && positionRef.current.x > window.innerWidth - nekoWidthRef.current) {
                // Hit right wall
                if (velocityRef.current.x > 0) {
                    velocityRef.current = { x: -velocityRef.current.x * elasticity, y: velocityRef.current.y };
                } else {
                    positionRef.current = { x: window.innerWidth - nekoWidthRef.current, y: positionRef.current.y };
                }
            }
        }
        // calculate velocity
        let velocityRecX = interval && 0.8 * (positionRef.current.x - lastpositionRef.current[0].x) / interval / lastpositionRef.current.length;
        let velocityRecY = interval && 0.8 * (positionRef.current.y - lastpositionRef.current[0].y) / interval / lastpositionRef.current.length;
        if (Math.abs(velocityRecX) < 0.5) {
            velocityRecX = 0;
        }
        setVelocityRec({ x: velocityRecX, y: velocityRecY });
        // velocityRef.current = velocityRec;
        if (touchingRef.current) velocityRef.current = velocityRec;
        lastpositionRef.current.shift();
        lastpositionRef.current.push({ x: positionRef.current.x, y: positionRef.current.y });
        // Move
        // if (!touchingRef.current) positionRef.current = { x: positionRef.current.x + velocityRec.x * interval, y: positionRef.current.y + velocityRec.y * interval };
        if (!touchingRef.current) positionRef.current = { x: positionRef.current.x + velocityRef.current.x * interval, y: positionRef.current.y + velocityRef.current.y * interval };
        // Finish RAF logic
        previousTimestampRef.current = timestamp;
        animationRef.current = requestAnimationFrame(updatePhysics);
    }

    useEffect(() => {
        // neko element bind
        if (nekoRef.current) {
            nekoRef.current = document.getElementById('vneko');
            nekoRef.current.addEventListener('touchmove', handleDrag, { passive: false });
            nekoRef.current.addEventListener('mousemove', handleDrag, { passive: false });
            nekoWidthRef.current = nekoRef.current.offsetWidth;
            nekoHeightRef.current = nekoRef.current.offsetHeight;
        }
        // window cursor position track
        window.addEventListener('mousemove', handleDrag, { passive: false });
        window.addEventListener('mouseup', handleMouseOutEnd, { passive: false });
        // first login
        if (!login.current) {
            checkEvents();
            // hide
            setHide(true);
            setTimeout(() => {
                setHide(false);
                setNeko(constNeko);
            }, randInt(300, 500));
            // first load anim
            if (currentFx === 'ballons') fullScreenBalloons();
            // end
            login.current = true;
        }
        // Start animation
        animationRef.current = requestAnimationFrame(updatePhysics);
        // Blinking animation, switch between normal and sleepy
        const blinkInterval = setInterval(() => {
            setNeko(neko_eyeclosed);
            setTimeout(() => {
                setNeko(constNeko);
                // Small chances to blink again
                if (randInt(0, 100) > 80) {
                    setTimeout(() => {
                        setNeko(neko_eyeclosed);
                        setTimeout(() => {
                            setNeko(constNeko);
                        }, 150);
                    }, 100);
                }
            }, 150);
        }, randInt(2000, 5000));
        // Randomly change the neko's emotion
        const emotionInterval = setInterval(() => {
            const emotion = randInt(0, 100);
            if (emotion < 5) {
                setNeko(neko_sad);
            } else if (emotion < 15) {
                setNeko(neko_eyeclosed);
            } else if (emotion < 25) {
                setNeko(neko_confused);
            } else if (emotion < 30) {
                setNeko(neko_surprised);
            } else if (emotion < 90) {
                setNeko(neko_normal);
            } else {
                setNeko(neko_happy);
            }
        }, 10000);
        // add custon event listener
        const nekoWhisker = document.getElementById('whisker');
        nekoWhisker && nekoWhisker.addEventListener('contact', handleContact);
        return () => {
            clearInterval(blinkInterval);
            clearInterval(emotionInterval);
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
            if (nekoRef.current) {
                nekoRef.current.removeEventListener('touchmove', handleDrag);
                nekoRef.current.removeEventListener('mousemove', handleDrag);
            }
            if (nekoWhisker) nekoWhisker.removeEventListener('contact', handleContact);
            cancelAnimationFrame(animationRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookies.neko]);


    return (
        <div style={{
            display: cookies.neko === 'false' ? 'none' : 'block',
            userSelect: "none",
            WebkitUserSelect: "none",
        }}>
            {/* dev mode */}
            {devmode && (ENV !== 'production') &&
                <div>
                    <hr />
                    <div style={{
                        margin: "0% 6%",
                        fontSize: '.85em',
                    }}>
                        {/* track visualization */}
                        {devTrack && lastpositionRef.current.map(
                            (dot, index) => {
                                return (
                                    <span
                                        key={index}
                                        style={{
                                            position: 'fixed',
                                            bottom: dot.y,
                                            left: dot.x,
                                        }}>{index}</span>)
                            })}
                        <button
                            onClick={() => setDevmodeDisplay(!devmodeDisplay)}
                            style={{
                                cursor: 'pointer',
                                fontSize: 'smaller',
                                userSelect: 'none',
                                border: 'none',
                                background: 'none',
                                color: 'var(--emphases)',
                            }}>dev info</button>
                        <div style={{ display: devmodeDisplay ? 'block' : 'none' }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>window size</td>
                                        <td>{`${window.innerWidth} * ${window.innerHeight}`}</td>
                                    </tr>
                                    <tr>
                                        <td>neko position</td>
                                        <td>{`${positionRef.current.x.toFixed(2)}, ${positionRef.current.y.toFixed(2)}`}</td>
                                    </tr>
                                    <tr>
                                        <td>velocity</td>
                                        <td>{`${velocityRef.current.x.toFixed(2)}, ${velocityRef.current.y.toFixed(2)}`}</td>
                                    </tr>
                                    <tr>
                                        <td>velocity rec</td>
                                        <td>{`${velocityRec.x.toFixed(2)}, ${velocityRec.y.toFixed(2)}`}</td>
                                    </tr>
                                    <tr>
                                        <td>show track</td>
                                        <td>
                                            <label htmlFor="devTrack">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => setDevTrack(!devTrack)}
                                                    checked={devTrack === true}
                                                /> {devTrack ? 'on' : 'off'}
                                            </label></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {touchingRef.current ?
                                                <span style={{ color: 'green' }}>touching</span>
                                                :
                                                <span style={{ color: 'grey' }}>touching</span>
                                            }
                                        </td>
                                        <td>
                                            {hide ?
                                                <span style={{ color: 'green' }}>hide</span>
                                                :
                                                <span style={{ color: 'grey' }}>hide</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>current fx</td>
                                        <td>{currentFx}, {balloonsArray.length}</td>
                                    </tr>
                                    <tr>
                                        <td>last whisker</td>
                                        <td>{lastWhiskerRef.current}</td>
                                    </tr>
                                    <tr>
                                        <td>calendar event</td>
                                        <td>
                                            {checkEvents().map((event, index) => {
                                                return <span key={index}>{event}; </span>
                                            })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
            {/* neko whisker */}
            <input id='whisker' type='text' size={1}
                title='whisker' placeholder=''
                onChange={handleContact}
                style={{
                    display: "none",
                }}
            ></input>
            {/* fx */}
            {balloonsArray && balloonsArray.map((balloon) => balloon.element)}
            {/* neko main */}
            <div
                id='vneko'
                ref={nekoRef}
                role='button'
                tabIndex={0}
                style={{
                    position: 'fixed',
                    bottom: positionRef.current.y,
                    left: positionRef.current.x,
                    cursor: 'grab',
                    userSelect: 'none',
                }}

                onKeyDown={() => { }}

                // start
                onMouseDown={handleTouchStart}
                onTouchStart={handleTouchStart}

                // move
                onMouseMove={handleDrag}
                onTouchMove={handleDrag}

                // end
                onMouseUp={handleTouchEnd}
                onBlur={handleTouchEnd}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                {/* decoration - hat */}
                <div
                    id='decorationHat'
                    style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        userSelect: 'none',
                    }}
                >
                    {nekoHatRef.current}
                </div>
                <pre
                    style={{
                        userSelect: 'none',
                        fontSize: '.8em',
                        lineHeight: 1,
                        color: 'var(--emphases)',
                        textShadow: '0 0 .3em var(--bg)',
                    }}
                >
                    {hide ? neko_hide : neko}
                </pre>
            </div>
        </div>
    );
};

export default Vneko;
