// backToTop.tsx
"use client"
import React, { useState, useEffect } from "react"
import "./BackToTop.css"

const BackToTopButton = () => {
    const [isNearTheTop, setIsNearTheTop] = useState(true)

    useEffect(() => {
        const back2top = document.getElementById("back2top")
        const handleScroll = () => {
            if (back2top === null) return
            if (window.scrollY > window.innerHeight * 0.618) {
                back2top.style.opacity = '1'
                back2top.style.cursor = "pointer"
                setIsNearTheTop(false)
            } else {
                back2top.style.opacity = '0'
                back2top.style.cursor = "default"
                setIsNearTheTop(true)
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleClick = () => {
        if (!isNearTheTop) window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <button id="back2top" className="backToTopButton" onClick={handleClick} aria-label="back to top">
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512" fill="currentColor">
                <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
            </svg>
        </button>
    )
}

export default BackToTopButton