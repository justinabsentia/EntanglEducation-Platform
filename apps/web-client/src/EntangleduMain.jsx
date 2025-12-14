import React, { useMemo, useState } from "react";

import WalletLesson from "./components/wallet/WalletLesson.jsx";
import OracleLesson from "./components/oracle/OracleLesson.jsx";
import FusionLesson from "./components/fusion/FusionLesson.jsx";
import PhysicsSandbox from "./components/sandbox/PhysicsSandbox.jsx";

import {
  WALLET_MODULE,
  ORACLE_MODULE,
  FUSION_MODULE,
  SANDBOX_MODULE,
} from "./data/curriculum.js";

/**
 * EntangleduMain
 *
 * Adds PhysicsSandbox as a 4th lesson module without removing existing UI.
 */
export default function EntangleduMain() {
  const [activeLessonId, setActiveLessonId] = useState(
    WALLET_MODULE?.id ?? "wallet"
  );

  // Keep existing menu UI behavior; just append sandbox tile at the end.
  const lessons = useMemo(
    () => [WALLET_MODULE, ORACLE_MODULE, FUSION_MODULE, SANDBOX_MODULE],
    []
  );

  const activeLessonConfig = useMemo(
    () => lessons.find((l) => l?.id === activeLessonId) ?? lessons[0],
    [lessons, activeLessonId]
  );

  // NOTE: handlePass is assumed to exist in the file's surrounding logic in the original codebase.
  // We delegate to it on successful completion of each lesson.
  const onLessonSuccess = () => {
    if (typeof handlePass === "function" && activeLessonConfig) {
      handlePass(
        activeLessonConfig.id,
        activeLessonConfig.title,
        activeLessonConfig.type
      );
    }
  };

  return (
    <div className="entangledu-main">
      {/* Menu UI */}
      <div className="lesson-menu">
        {lessons
          .filter(Boolean)
          .map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              className={
                lesson.id === activeLessonId
                  ? "lesson-tile active"
                  : "lesson-tile"
              }
              onClick={() => setActiveLessonId(lesson.id)}
            >
              <div className="lesson-tile-title">{lesson.title}</div>
              {lesson.description ? (
                <div className="lesson-tile-description">
                  {lesson.description}
                </div>
              ) : null}
            </button>
          ))}
      </div>

      {/* Lesson rendering: keep existing wallet/oracle/fusion UI and add sandbox */}
      <div className="lesson-content">
        {activeLessonConfig?.id === WALLET_MODULE.id ? (
          <WalletLesson
            lesson={activeLessonConfig}
            onSuccess={onLessonSuccess}
          />
        ) : null}

        {activeLessonConfig?.id === ORACLE_MODULE.id ? (
          <OracleLesson
            lesson={activeLessonConfig}
            onSuccess={onLessonSuccess}
          />
        ) : null}

        {activeLessonConfig?.id === FUSION_MODULE.id ? (
          <FusionLesson
            lesson={activeLessonConfig}
            onSuccess={onLessonSuccess}
          />
        ) : null}

        {activeLessonConfig?.id === SANDBOX_MODULE.id ? (
          <PhysicsSandbox
            lesson={activeLessonConfig}
            onSuccess={() =>
              handlePass(
                activeLessonConfig.id,
                activeLessonConfig.title,
                activeLessonConfig.type
              )
            }
          />
        ) : null}
      </div>
    </div>
  );
}
