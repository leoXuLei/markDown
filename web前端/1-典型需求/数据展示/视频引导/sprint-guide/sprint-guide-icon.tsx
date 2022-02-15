import React, { useEffect, useCallback, useState } from "react";
import { Modal, Image } from "@com/sun";
import useAppSelector from "client/hooks/use-app-selector";
import { YoutubeOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const InfoIcon = styled(YoutubeOutlined)`
  margin-left: 6px;
  font-size: 16px;
  vertical-align: sub;
  &:hover {
    color: #1b9aee;
  }
`;

export function SprintGuideIcon() {
  const [showGuide, setShowGuide] = useState(false);
  const [muted, setMuted] = useState(true);

  const showDialog = useCallback((isShow, isMuted = true) => {
    const $video = document.getElementById(
      "sprint-guide-video"
    ) as HTMLVideoElement;

    setShowGuide(isShow);
    setMuted(isMuted);

    if ($video) {
      if (isShow) {
        $video.currentTime = 0;
        $video.play();
      } else {
        $video.pause();
      }
    }
  }, []);

  useEffect(() => {
    const storeKey = "viewed-sprint-video";
    const hasViewed = localStorage.getItem(storeKey);

    /** 没有看过引导 */
    if (!hasViewed) {
      setShowGuide(true);

      localStorage.setItem(storeKey, "yes");
    }
  }, []);

  return (
    <>
      <InfoIcon onClick={() => showDialog(true, false)} />
      <Modal
        centered
        visible={showGuide}
        onCancel={() => showDialog(false)}
        title="迭代操作步骤"
        footer={null}
        width={1000}
      >
        <video
          id={"sprint-guide-video"}
          autoPlay
          muted={muted}
          loop={false}
          style={{ width: "100%" }}
          controls
          src=""
        />
      </Modal>
    </>
  );
}
