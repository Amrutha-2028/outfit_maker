import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import "./ClothingCarousel.css";

const swipeConfidenceThreshold = 10000;

const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export default function ClothingCarousel({
    items,
    type,
    onDelete,
}) {
    const [[page, direction], setPage] = useState([0, 0]);

    if (items.length === 0) return null;

    const currentPage = Math.min(page, items.length - 1);

    useEffect(() => {
        if (page >= items.length && items.length > 0) {
            setPage([items.length - 1, 0]);
        }
    }, [items.length, page]);

    const paginate = (newDirection) => {
        setPage([
            (currentPage + newDirection + items.length) % items.length,
            newDirection,
        ]);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 450 : -450,
            opacity: 0,
            scale: 0.85,
        }),

        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },

        exit: (direction) => ({
            x: direction < 0 ? 450 : -450,
            opacity: 0,
            scale: 0.85,
        }),
    };

    return (
        <div className="carousel">
            <div className="image-wrapper">
                <button
                    className="delete-btn"
                    onClick={() => onDelete(items[currentPage].id, type)}
                >
                    🗑️
                </button>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.img
                        key={items[currentPage].id}
                        src={items[currentPage].url}
                        className="clothing-image"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "tween", ease: "easeInOut", duration: 0.4 }, // Exactly 0.4 seconds
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 },
                        }}

                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.7}
                        whileTap={{ cursor: "grabbing" }}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                    />
                </AnimatePresence>
            </div>

            <div className="thumbnail-strip">
                {items.map((item, index) => (
                    <img
                        key={item.id}
                        src={item.url}
                        className={`thumbnail ${currentPage === index ? "selected" : ""
                            }`}
                        onClick={() =>
                            setPage([index, index > currentPage ? 1 : -1])
                        }
                    />
                ))}
            </div>
        </div>
    );
}