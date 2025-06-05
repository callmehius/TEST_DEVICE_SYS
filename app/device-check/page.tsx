"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "@/lib/cookies";
import {
  Camera,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Monitor,
  Mic,
  Network,
  ChevronLeft,
  ChevronRight,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Info,
  Shield,
  Download,
} from "lucide-react";
import { set } from "date-fns";

export default function DeviceCheckPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState([
    { id: 1, name: "Thông tin thiết bị", status: "pending" },
    { id: 2, name: "Kiểm tra camera", status: "pending" },
    { id: 3, name: "Kiểm tra microphone", status: "pending" },
    { id: 4, name: "Kiểm tra mạng", status: "pending" },
  ]);

  // Device Info State
  const [browserInfo, setBrowserInfo] = useState({ name: "", version: "" });
  const [osInfo, setOsInfo] = useState({ name: "", version: "" });
  const [deviceType, setDeviceType] = useState("");
  const [deviceInfoStatus, setDeviceInfoStatus] = useState<
    "checking" | "success" | "error"
  >("checking");

  // Camera State
  const [cameraStatus, setCameraStatus] = useState<
    "checking" | "success" | "error"
  >("checking");
  const [cameraMessage, setCameraMessage] = useState("Đang kiểm tra camera...");
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showCameraInstructions, setShowCameraInstructions] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);

  // Microphone State
  const [microphoneStatus, setMicrophoneStatus] = useState<
    "checking" | "success" | "error"
  >("checking");
  const [microphoneMessage, setMicrophoneMessage] = useState(
    "Đang kiểm tra microphone..."
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioConfirmed, setAudioConfirmed] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Network State
  const [networkStatus, setNetworkStatus] = useState<
    "checking" | "success" | "warning" | "error"
  >("checking");
  const [networkMessage, setNetworkMessage] = useState(
    "Đang kiểm tra kết nối mạng..."
  );
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [connectionIp, setConnectIp] = useState<string | null>(null);
  const [connectionDownLink, setConnectionDownLink] = useState<string | null>(
    null
  );
  const [connecttionRtt, setConnecttionRtt] = useState<string | null>(null);
  const [hasVPN, setHasVPN] = useState<boolean | null>(null);
  const [nameVPN, setNameVPN] = useState<string | null>(null);
  const [hasStaticDNS, setHasStaticDNS] = useState<boolean | null>(null);
  // const [connectDNS, setConnectDNS] = useState<string | null>(null)
  const [showNetworkInstructions, setShowNetworkInstructions] = useState(false);
  const [dnsServers, setDnsServers] = useState<string[]>([]);

  // Thêm state để lưu tên WiFi
  const [wifiName, setWifiName] = useState<string | null>(null);

  // Thêm state để hiển thị màn hình tổng kết
  const [showSummary, setShowSummary] = useState(false);

  // Check if user is authenticated and has the correct role
  useEffect(() => {
    // For demo purposes, check if auth cookie exists
    const hasAuthCookie = document.cookie.includes("auth_token=");
    if (!hasAuthCookie) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    const isAdmin = document.cookie.includes("user_role=admin");
    if (isAdmin) {
      router.push("/admin");
      return;
    }
  }, [router]);

  // Initialize checks based on current step
  useEffect(() => {
    if (currentStep === 1) {
      detectDeviceInfo();
    } else if (currentStep === 2) {
      checkCamera();
    } else if (currentStep === 3) {
      checkMicrophone();
    } else if (currentStep === 4) {
      checkNetwork();
    }

    // Clean up resources when changing steps
    return () => {
      // Clean up camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Clean up audio recorder
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [currentStep]);

  // Update steps status
  useEffect(() => {
    const updatedSteps = [...steps];

    if (currentStep === 1 && deviceInfoStatus !== "checking") {
      updatedSteps[0].status = deviceInfoStatus;
    } else if (currentStep === 2 && cameraStatus !== "checking") {
      updatedSteps[1].status = cameraStatus;
    } else if (currentStep === 3 && microphoneStatus !== "checking") {
      updatedSteps[2].status = microphoneStatus;
    } else if (currentStep === 4 && networkStatus !== "checking") {
      updatedSteps[3].status =
        networkStatus === "warning" ? "warning" : networkStatus;
    }

    setSteps(updatedSteps);
  }, [deviceInfoStatus, cameraStatus, microphoneStatus, networkStatus]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // STEP 1: Detect device information
  const detectDeviceInfo = () => {
    setDeviceInfoStatus("checking");

    try {
      debugger;
      // Detect browser
      const userAgent = navigator.userAgent;

      let browserName = "Unknown";
      let browserVersion = "Unknown";

      if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion =
          userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (userAgent.indexOf("Edg") > -1) {
        browserName = "Microsoft Edge";
        browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserVersion =
          userAgent.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
      } else if (
        userAgent.indexOf("MSIE") > -1 ||
        userAgent.indexOf("Trident") > -1
      ) {
        browserName = "Internet Explorer";
        browserVersion =
          userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)?.[1] || "Unknown";
      }

      setBrowserInfo({ name: browserName, version: browserVersion });

      // Detect OS
      let osName = "Unknown";
      let osVersion = "Unknown";

      if (userAgent.indexOf("Win") > -1) {
        osName = "Windows";
        if (userAgent.indexOf("Windows NT 10.0") > -1) osVersion = "10/11";
        else if (userAgent.indexOf("Windows NT 6.3") > -1) osVersion = "8.1";
        else if (userAgent.indexOf("Windows NT 6.2") > -1) osVersion = "8";
        else if (userAgent.indexOf("Windows NT 6.1") > -1) osVersion = "7";
        else if (userAgent.indexOf("Windows NT 6.0") > -1) osVersion = "Vista";
        else if (userAgent.indexOf("Windows NT 5.1") > -1) osVersion = "XP";
      } else if (userAgent.indexOf("Mac") > -1) {
        osName = "macOS";
        osVersion =
          userAgent.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, ".") ||
          "Unknown";
      } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
        osVersion = userAgent.match(/Android ([0-9.]+)/)?.[1] || "Unknown";
      } else if (
        userAgent.indexOf("iOS") > -1 ||
        userAgent.indexOf("iPhone") > -1 ||
        userAgent.indexOf("iPad") > -1
      ) {
        osName = "iOS";
        osVersion =
          userAgent.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, ".") || "Unknown";
      } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
        osVersion = "Unknown";
      }

      setOsInfo({ name: osName, version: osVersion });

      // Detect device type
      let type = "Desktop";
      if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        if (/iPad|Tablet/i.test(userAgent)) {
          type = "Tablet";
        } else {
          type = "Mobile";
        }
      }

      setDeviceType(type);
      setDeviceInfoStatus("success");
    } catch (error) {
      console.error("Error detecting device info:", error);
      setDeviceInfoStatus("error");
    }
  };

  // STEP 2: Check camera
  const checkCamera = async () => {
    setCameraStatus("checking");
    setCameraMessage("Đang kiểm tra camera...");
    setShowCameraPreview(false);
    setCapturedImage(null);
    setCameraInitialized(false);

    try {
      // Dừng stream hiện tại nếu có
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      console.log("Requesting camera access...");

      // Sử dụng nhiều cách khác nhau để truy cập camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        console.log("✅ Camera access granted");
        streamRef.current = stream;

        const waitUntilVideoReady = () => {
          const video = videoRef.current;
          if (!video) {
            console.warn("⏳ Waiting for video element to be mounted...");
            setTimeout(waitUntilVideoReady, 100);
            return;
          }

          console.log("🎥 Setting video source...");
          video.srcObject = stream;
          video.muted = true;
          video.playsInline = true;

          video.onloadedmetadata = () => {
            console.log("ℹ️ Video metadata loaded");

            // Delay to allow browser to fully initialize the stream
            setTimeout(() => {
              if (!video.isConnected || video.readyState < 1) {
                console.warn("⚠️ Video element not ready or disconnected");
                return;
              }

              video
                .play()
                .then(() => {
                  console.log("✅ Video playing successfully");
                  setShowCameraPreview(true);
                  setCameraInitialized(true);
                })
                .catch((err) => {
                  console.error("❌ Error playing video:", err);
                  setTimeout(() => {
                    video
                      .play()
                      .catch((e) => console.error("Retry play failed:", e));
                  }, 1000);
                });
            }, 300);
          };

          video.onplaying = () => {
            console.log("▶️ Video is playing (event)");
            setShowCameraPreview(true);
            setCameraInitialized(true);
          };

          video.onloadeddata = () => {
            console.log("📸 Video data loaded");
            setShowCameraPreview(true);
            setCameraInitialized(true);
          };
        };

        waitUntilVideoReady();

        setCameraStatus("success");
        setCameraMessage(
          "Camera hoạt động. Hãy kiểm tra xem bạn có nhìn thấy hình ảnh rõ ràng không."
        );
      } catch (err) {
        console.error("❌ Camera access failed:", err);
        setCameraStatus("error");
        setCameraMessage(
          "Không thể kết nối với camera. Vui lòng kiểm tra quyền truy cập."
        );
      }

      // Đặt nhiều timeout để đảm bảo camera hiển thị
      setTimeout(() => {
        if (!showCameraPreview && videoRef.current && streamRef.current) {
          console.log("Force showing camera preview after 500ms");
          setShowCameraPreview(true);
          setCameraInitialized(true);

          if (videoRef.current.paused) {
            videoRef.current
              .play()
              .catch((e) => console.error("Timeout play failed:", e));
          }
        }
      }, 500);

      setTimeout(() => {
        if (!showCameraPreview && videoRef.current && streamRef.current) {
          console.log("Second attempt to force camera preview after 2000ms");
          setShowCameraPreview(true);
          setCameraInitialized(true);

          // Thử tạo lại stream nếu vẫn không hiển thị
          if (videoRef.current.paused) {
            navigator.mediaDevices
              .getUserMedia({ video: true })
              .then((newStream) => {
                if (streamRef.current) {
                  streamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
                }
                streamRef.current = newStream;
                if (videoRef.current) {
                  videoRef.current.srcObject = newStream;
                  videoRef.current
                    .play()
                    .catch((e) =>
                      console.error("Retry play in timeout failed:", e)
                    );
                }
              })
              .catch((e) => console.error("Retry getUserMedia failed:", e));
          }
        }
      }, 2000);
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraStatus("error");
      setCameraMessage(
        "Không thể kết nối với camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt."
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && streamRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);

        // Không dừng camera stream để người dùng có thể chụp lại nếu muốn
        // streamRef.current.getTracks().forEach((track) => track.stop())
        // setShowCameraPreview(false)
      }
    }
  };

  const resetCamera = () => {
    // Clear captured image
    setCapturedImage(null);

    // Restart camera
    checkCamera();
  };

  // STEP 3: Check microphone
  const checkMicrophone = async () => {
    setMicrophoneStatus("checking");
    setMicrophoneMessage("Đang kiểm tra microphone...");
    setAudioURL(null);
    setAudioConfirmed(false);

    try {
      // Check if microphone is available
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Microphone is available
      setMicrophoneStatus("success");
      setMicrophoneMessage(
        "Microphone hoạt động tốt. Bạn có thể ghi âm để kiểm tra."
      );

      // Stop the stream since we're not using it yet
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Microphone access error:", error);
      setMicrophoneStatus("error");
      setMicrophoneMessage(
        "Không thể kết nối với microphone. Vui lòng kiểm tra quyền truy cập microphone của trình duyệt."
      );
    }
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setIsRecording(false);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Automatically stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 5000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setMicrophoneStatus("error");
      setMicrophoneMessage(
        "Không thể ghi âm. Vui lòng kiểm tra quyền truy cập microphone của trình duyệt."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const confirmAudioPlayback = (heard: boolean) => {
    setAudioConfirmed(true);
    if (!heard) {
      setMicrophoneStatus("error");
      setMicrophoneMessage(
        "Bạn không nghe thấy âm thanh. Vui lòng kiểm tra lại microphone và loa của bạn."
      );
    }
  };

  // STEP 4: Check network
  const checkNetwork = async () => {
    setNetworkStatus("checking");
    setNetworkMessage("Đang kiểm tra kết nối mạng...");
    setConnectionType(null);
    setConnectIp(null);
    setHasVPN(null);
    setHasStaticDNS(null);
    setDnsServers([]);

    try {
      debugger;
      //Xử lý gọi API đọc thông tin
      // const token = getCookie("auth_token");
      // if (!token) {
      //   console.error("❌ Không tìm thấy auth_token trong cookie");
      //   return;
      // }
      const response = await fetch("https://demo.vlu.edu.vn/api/DeviceSummary", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      var message = "";
      if (data.isInRangeIp == true) {
        setNetworkStatus("success");
        message = "Đã kết nối thành công Wifi-Thi";
        setConnectIp(`${data.ipAddresses}`);
      } else if (!data.isInRangeIp == true) {
        setConnectIp(`${data.ipAddresses}`);
        setNetworkStatus("warning");
        message = "Nên kết nối vào Wifi - THI để truy cập làm bài thi CTE";
      }
      if (data.isInRangeIp == true && (data.isVpn == true || data.isDNS == true)) {
         setHasVPN(true);
        setHasStaticDNS(true);
        setNetworkStatus("warning");
        message =
          message +
          `<br>Nhưng thiết bị đang có cài đặt "VPN/DNS tĩnh/Hoặc có kết nối internet bên ngoài" có thể ảnh hưởng đến truy cập hệ thống thi.`;
      } else if ((data.isVpn == true || data.isDNS == true)) {
        setHasVPN(true);
        setHasStaticDNS(true);
        setNetworkStatus("warning");
        message =
          message +
          `.<br>Phát hiện "VPN/DNS tĩnh/Hoặc có kết nối internet bên ngoài" : ${data?.jsonDns?.dns?.geo}.<br>Điều này có thể ảnh hưởng đến truy cập hệ thống thi.`;
        setDnsServers(data?.jsonDns?.dns?.geo);
      }
      else{
        setHasVPN(false);
        setHasStaticDNS(false);
      }
      setNetworkMessage(message);

      const connectionInfo = navigator.connection;
      setConnecttionRtt(connectionInfo.rtt);
      setConnectionDownLink(connectionInfo.downlink);
      if (!connectionInfo || !connectionInfo.effectiveType) {
        setConnectionType("Không thể xác định loại mạng.");
      } else if (connectionInfo.effectiveType === "slow-2g") {
        setConnectionType("Mạng rất yếu.");
      } else if (connectionInfo.effectiveType === "2g") {
        setConnectionType("Mạng yếu.");
      } else if (connectionInfo.effectiveType === "3g") {
        setConnectionType("Mạng trung bình.");
      } else if (connectionInfo.effectiveType === "4g") {
        setConnectionType("Mạng tốt.");
      } else {
        setConnectionType("Loại mạng không xác định");
      }
      fetch('https://edns.ip-api.com/json')
      .then((res) => res.json())
      .then((data) => {
        // setDnsInfo(data.dns);
        // setEdnsInfo(data.edns || null);
      })
      .catch((err) => {
        // setError('Lỗi khi lấy thông tin EDNS');
        console.error(err);
      });
    } catch (error) {
      console.error("Network check error:", error);
      setNetworkStatus("error");
      setNetworkMessage("Không thể kiểm tra kết nối mạng.");
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Hiển thị màn hình tổng kết khi hoàn thành
      setShowSummary(true);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return (currentStep / 4) * 100;
  };

  // Check if current step is complete and can proceed
  const canProceed = () => {
    if (currentStep === 1) {
      return deviceInfoStatus === "success";
    } else if (currentStep === 2) {
      return cameraStatus === "success" && cameraInitialized;
    } else if (currentStep === 3) {
      return (
        microphoneStatus === "success" && audioURL !== null && audioConfirmed
      );
    } else if (currentStep === 4) {
      return networkStatus === "success" || networkStatus === "warning";
    }
    return false;
  };

  // Thêm useEffect để tự động kích hoạt camera nếu không hiển thị sau 3 giây
  useEffect(() => {
    if (currentStep === 2 && cameraStatus === "success" && !showCameraPreview) {
      const timer = setTimeout(() => {
        if (!showCameraPreview && videoRef.current && streamRef.current) {
          console.log("Force showing camera preview after timeout");
          setShowCameraPreview(true);
          setCameraInitialized(true);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, cameraStatus, showCameraPreview]);

  // Thêm hàm để chụp ảnh khi người dùng nhấn "Tôi nhìn thấy rõ, tiếp tục"
  const handleCameraConfirm = () => {
    // Chụp ảnh trước khi tiếp tục
    capturePhoto();
    // Tiếp tục sang bước tiếp theo
    goToNextStep();
  };

  // Hàm để tải xuống báo cáo tổng kết
  const downloadSummary = () => {
    // Tạo nội dung báo cáo
    const reportContent = `
      BÁO CÁO KIỂM TRA TƯƠNG THÍCH THIẾT BỊ
      -------------------------------------
      Thời gian: ${new Date().toLocaleString()}
      
      1. THÔNG TIN THIẾT BỊ
      - Trình duyệt: ${browserInfo.name} ${browserInfo.version}
      - Hệ điều hành: ${osInfo.name} ${osInfo.version}
      - Loại thiết bị: ${deviceType}
      
      2. CAMERA
      - Trạng thái: ${
        cameraStatus === "success" ? "Hoạt động tốt" : "Có vấn đề"
      }
      
      3. MICROPHONE
      - Trạng thái: ${
        microphoneStatus === "success" ? "Hoạt động tốt" : "Có vấn đề"
      }
      
      4. MẠNG
      - Trạng thái: ${
        networkStatus === "success"
          ? "Hoạt động tốt"
          : networkStatus === "warning"
          ? (networkMessage)
          : "Có vấn đề"
      }
    `;

    // Tạo blob và tải xuống
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kiem-tra-thiet-bi-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  //
  // 🔻 THÊM NGAY SAU ĐÂY:
  const saveSummaryToServer = async () => {
    const summary = {
      browserName: browserInfo.name,
      browserVersion: browserInfo.version,
      osName: osInfo.name,
      osVersion: osInfo.version,
      deviceType,

      stepsJson: JSON.stringify(steps),
      cameraStatus,
      capturedImageBase64: capturedImage,
      microphoneStatus,
      audioUrl: audioURL,

      networkStatus,
      connectionType:"IP: "+ connectionIp +" / "+connectionDownLink+" Mbps / RTT"+connecttionRtt,
      hasVPN,
      hasStaticDNS,
      dnsServersJson: JSON.stringify(dnsServers),
      wifiName: connectionType,
      email: getCookie("email"),
      timestamp: new Date().toISOString(),
    };

    try {
      const token = getCookie("auth_token");
      if (!token) {
        console.error("❌ Không tìm thấy auth_token trong cookie");
        return;
      }
      const response = await fetch("https://demo.vlu.edu.vn/api/DeviceSummary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(summary),
      });
      debugger;
      if (!response.ok) throw new Error("Không thể lưu vào hệ thống");
      alert("✔ Thiết bị đã được lưu vào hệ thống thành công!");
      location.reload();
    } catch (error) {
      alert("❌ Đã xảy ra lỗi khi lưu thiết bị");
    }
  };
  // Hàm để quay lại kiểm tra
  const backToCheck = () => {
    setShowSummary(false);
    setCurrentStep(1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      {!showSummary ? (
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <CardTitle className="text-2xl font-bold">
              Kiểm Tra Tương Thích Thiết Bị
            </CardTitle>
            <CardDescription>
              Hệ thống sẽ kiểm tra các thiết bị của bạn để đảm bảo tương thích
              với hệ thống.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Bước {currentStep}: {steps[currentStep - 1].name}
                </span>
                <span className="text-sm text-muted-foreground">
                  Bước {currentStep}/4
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            {/* Steps navigation */}
            <div className="mb-6">
              <Tabs
                defaultValue={currentStep.toString()}
                onValueChange={(value) =>
                  setCurrentStep(Number.parseInt(value))
                }
              >
                <TabsList className="grid grid-cols-4 w-full">
                  {steps.map((step) => (
                    <TabsTrigger
                      key={step.id}
                      value={step.id.toString()}
                      disabled={
                        step.id > 1 && steps[step.id - 2].status !== "success"
                      }
                      className="relative"
                    >
                      {step.name}
                      {step.status === "success" && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      )}
                      {step.status === "error" && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="h-3 w-3 text-white" />
                        </span>
                      )}
                      {step.status === "warning" && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 text-white" />
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Step 1: Device Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      deviceInfoStatus === "checking"
                        ? "bg-gray-100"
                        : deviceInfoStatus === "success"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Monitor
                      className={`h-6 w-6 ${
                        deviceInfoStatus === "checking"
                          ? "text-gray-500"
                          : deviceInfoStatus === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Thông tin thiết bị</h3>
                    <p className="text-sm text-muted-foreground">
                      {deviceInfoStatus === "checking"
                        ? "Đang phát hiện thông tin thiết bị..."
                        : deviceInfoStatus === "success"
                        ? "Đã phát hiện thông tin thiết bị thành công"
                        : "Không thể phát hiện đầy đủ thông tin thiết bị"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {deviceInfoStatus === "checking" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    ) : deviceInfoStatus === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>

                {deviceInfoStatus !== "checking" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Trình duyệt</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Tên:
                          </span>
                          <p className="font-medium">{browserInfo.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Phiên bản:
                          </span>
                          <p className="font-medium">{browserInfo.version}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Monitor className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Hệ điều hành</h3>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Tên:
                          </span>
                          <p className="font-medium">{osInfo.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Phiên bản:
                          </span>
                          <p className="font-medium">{osInfo.version}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {deviceType === "Desktop" ? (
                          <Laptop className="h-5 w-5 text-primary" />
                        ) : deviceType === "Mobile" ? (
                          <Smartphone className="h-5 w-5 text-primary" />
                        ) : (
                          <Tablet className="h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-medium">Loại thiết bị</h3>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Thiết bị:
                        </span>
                        <p className="font-medium">{deviceType}</p>
                      </div>
                    </div>
                  </div>
                )}

                {deviceInfoStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Lỗi phát hiện thông tin thiết bị</AlertTitle>
                    <AlertDescription>
                      Không thể phát hiện đầy đủ thông tin thiết bị. Vui lòng
                      làm mới trang và thử lại.
                    </AlertDescription>
                    <div className="mt-4">
                      <Button onClick={detectDeviceInfo} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Thử lại
                      </Button>
                    </div>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 2: Camera Check */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      cameraStatus === "checking"
                        ? "bg-gray-100"
                        : cameraStatus === "success"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Camera
                      className={`h-6 w-6 ${
                        cameraStatus === "checking"
                          ? "text-gray-500"
                          : cameraStatus === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Camera</h3>
                    <p className="text-sm text-muted-foreground">
                      {cameraMessage}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {cameraStatus === "checking" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    ) : cameraStatus === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>

                {cameraStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Lỗi kết nối camera</AlertTitle>
                    <AlertDescription>
                      Không thể kết nối với camera của bạn. Vui lòng đảm bảo:
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Thiết bị của bạn có camera</li>
                        <li>
                          Bạn đã cấp quyền truy cập camera cho trình duyệt
                        </li>
                        <li>Không có ứng dụng nào khác đang sử dụng camera</li>
                      </ul>
                    </AlertDescription>
                    <div className="mt-4">
                      <Button onClick={checkCamera} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Thử lại
                      </Button>
                    </div>
                  </Alert>
                )}

                {cameraStatus === "success" && (
                  <div className="mt-4 border rounded-lg p-4">
                    <div className="text-center mb-4">
                      <h3 className="font-medium">Kiểm tra camera</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Hãy kiểm tra xem bạn có nhìn thấy hình ảnh của mình rõ
                        ràng không.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 mb-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Hướng dẫn kiểm tra:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Hình ảnh phải rõ nét, không bị mờ</li>
                              <li>Màu sắc phải tự nhiên, không bị một màu</li>
                              <li>Không bị đen hoặc trắng toàn bộ màn hình</li>
                              <li>
                                Nếu bạn di chuyển, hình ảnh phải di chuyển theo
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Camera preview - always visible when camera is success */}
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />

                      {!showCameraPreview && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />
                          <p className="text-white ml-3">
                            Đang khởi tạo camera...
                          </p>
                        </div>
                      )}

                      {capturedImage && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded">
                          <div className="text-white text-xs">Đã chụp ảnh</div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCameraInstructions(true)}
                        className="gap-2"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Tôi không thấy rõ hình ảnh
                      </Button>
                      <Button onClick={handleCameraConfirm} className="gap-2">
                        <Check className="h-4 w-4" />
                        Tôi nhìn thấy rõ, tiếp tục
                      </Button>
                    </div>
                  </div>
                )}

                {showCameraInstructions && (
                  <div className="mt-4 border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-blue-700">
                        Hướng dẫn xử lý vấn đề camera
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCameraInstructions(false)}
                        className="h-6 w-6 p-0 rounded-full"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Đóng</span>
                      </Button>
                    </div>

                    <div className="space-y-3 text-sm text-blue-700">
                      <div>
                        <h4 className="font-medium mb-1">
                          Nếu không thấy hình ảnh hoặc hình ảnh đen:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Đảm bảo bạn đã cho phép trình duyệt truy cập camera
                          </li>
                          <li>
                            Kiểm tra xem có ứng dụng nào khác đang sử dụng
                            camera không
                          </li>
                          <li>Thử làm mới trang và cấp quyền lại</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">
                          Nếu hình ảnh bị mờ hoặc không rõ:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Lau sạch ống kính camera</li>
                          <li>Đảm bảo đủ ánh sáng trong phòng</li>
                          <li>Điều chỉnh vị trí của thiết bị</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">
                          Nếu hình ảnh bị một màu hoặc có vấn đề về màu sắc:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Kiểm tra xem camera có bị che chắn không</li>
                          <li>Khởi động lại thiết bị</li>
                          <li>Thử sử dụng trình duyệt khác</li>
                        </ul>
                      </div>

                      <div className="pt-2">
                        <Button onClick={checkCamera} className="gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Thử lại
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden canvas for capturing photos */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* Step 3: Microphone Check */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      microphoneStatus === "checking"
                        ? "bg-gray-100"
                        : microphoneStatus === "success"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Mic
                      className={`h-6 w-6 ${
                        microphoneStatus === "checking"
                          ? "text-gray-500"
                          : microphoneStatus === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Microphone</h3>
                    <p className="text-sm text-muted-foreground">
                      {microphoneMessage}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {microphoneStatus === "checking" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    ) : microphoneStatus === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>

                {microphoneStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Lỗi kết nối microphone</AlertTitle>
                    <AlertDescription>
                      Không thể kết nối với microphone của bạn. Vui lòng đảm
                      bảo:
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Thiết bị của bạn có microphone</li>
                        <li>
                          Bạn đã cấp quyền truy cập microphone cho trình duyệt
                        </li>
                        <li>
                          Không có ứng dụng nào khác đang sử dụng microphone
                        </li>
                      </ul>
                    </AlertDescription>
                    <div className="mt-4">
                      <Button onClick={checkMicrophone} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Thử lại
                      </Button>
                    </div>
                  </Alert>
                )}

                {microphoneStatus === "success" &&
                  !isRecording &&
                  !audioURL && (
                    <div className="mt-4 border rounded-lg p-4">
                      <div className="text-center mb-4">
                        <h3 className="font-medium">Ghi âm kiểm tra</h3>
                        <p className="text-sm text-muted-foreground">
                          Nhấn nút bên dưới để ghi âm 5 giây. Hãy nói một vài từ
                          để kiểm tra microphone.
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={startRecording} className="gap-2">
                          <Mic className="h-4 w-4" />
                          Bắt đầu ghi âm
                        </Button>
                      </div>
                    </div>
                  )}

                {isRecording && (
                  <div className="mt-4 border rounded-lg p-4 border-red-200 bg-red-50">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-red-700">
                        Đang ghi âm...
                      </h3>
                      <p className="text-sm text-red-600">
                        Hãy nói một vài từ để kiểm tra microphone.
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 relative">
                        <Mic className="h-8 w-8 text-red-500" />
                        <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></div>
                      </div>
                      <div className="text-2xl font-bold text-red-700 mb-4">
                        {recordingTime}s
                      </div>
                      <Button
                        variant="destructive"
                        onClick={stopRecording}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Dừng ghi âm
                      </Button>
                    </div>
                  </div>
                )}

                {audioURL && !audioConfirmed && (
                  <div className="mt-4 border rounded-lg p-4">
                    <div className="text-center mb-4">
                      <h3 className="font-medium">Phát lại âm thanh</h3>
                      <p className="text-sm text-muted-foreground">
                        Nghe lại đoạn ghi âm và xác nhận bạn có nghe thấy âm
                        thanh không.
                      </p>
                    </div>
                    <div className="flex justify-center mb-4">
                      <audio
                        controls
                        src={audioURL}
                        className="w-full max-w-md"
                      ></audio>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => confirmAudioPlayback(false)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Không nghe thấy
                      </Button>
                      <Button
                        onClick={() => confirmAudioPlayback(true)}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Nghe rõ
                      </Button>
                    </div>
                  </div>
                )}

                {audioConfirmed && microphoneStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700">
                      Kiểm tra microphone thành công
                    </AlertTitle>
                    <AlertDescription className="text-green-600">
                      Microphone của bạn hoạt động tốt. Bạn có thể tiếp tục sang
                      bước tiếp theo.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 4: Network Check */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      networkStatus === "checking"
                        ? "bg-gray-100"
                        : networkStatus === "success"
                        ? "bg-green-100"
                        : networkStatus === "warning"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Network
                      className={`h-6 w-6 ${
                        networkStatus === "checking"
                          ? "text-gray-500"
                          : networkStatus === "success"
                          ? "text-green-500"
                          : networkStatus === "warning"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Kết nối mạng</h3>
                    <div>
                      {networkStatus === "success" ? (
                        <p
                          className="text-sm text-green-600 text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: networkMessage }}
                        ></p>
                      ) : networkStatus === "warning" ? (
                        <p
                          className="text-sm text-red-600 text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: networkMessage }}
                        ></p>
                      ) : networkStatus === "error" ? (
                        <p
                          className="text-sm text-red-600 text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: networkMessage }}
                        ></p>
                      ) : null}
                    </div>
                  </div>
                  <div className="ml-auto">
                    {networkStatus === "checking" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    ) : networkStatus === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : networkStatus === "warning" ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>

                {networkStatus !== "checking" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Network className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Loại kết nối</h3>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Kết nối:
                        </span>
                        <p>IP: {connectionIp}</p>
                        <p>Downlink: {connectionDownLink} Mbps</p>
                        <p>RTT: {connecttionRtt} </p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">VPN/DNS tĩnh/Hoặc kết nối internet bên ngoài</h3>
                      </div>
                      <div className="flex flex-col">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Trạng thái:
                          </span>
                          {hasStaticDNS === null ? (
                            <p>Đang kiểm tra...</p>
                          ) : hasStaticDNS && dnsServers.length > 0 ? (
                            <div>
                              <p className="flex items-center text-red-600 font-medium">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Phát hiện
                              </p>
                              <p className="flex items-center text-red-600 font-medium">
                                {dnsServers}
                              </p>
                            </div>
                          ) : (
                            <p className="flex items-center text-green-600 font-medium">
                              <Check className="h-4 w-4 mr-1" />
                              Không phát hiện
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {networkStatus === "warning" && (
                  <Alert
                    variant="warning"
                    className="bg-yellow-50 border-yellow-200"
                  >
                    <AlertDescription className="text-yellow-600">
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShowNetworkInstructions(!showNetworkInstructions)
                          }
                          className="gap-2"
                        >
                          <Info className="h-4 w-4" />
                          {showNetworkInstructions
                            ? "Ẩn hướng dẫn"
                            : "Xem hướng dẫn khắc phục"}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {showNetworkInstructions && (
                  <div className="mt-4 border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <h3 className="font-medium text-blue-700 mb-2">
                      Hướng dẫn khắc phục
                    </h3>
                    {
                      <div>
                        <h4 className="font-medium text-blue-600 mb-1">
                          Đặt DNS về tự động:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                          <li>
                            <strong>Windows:</strong> Mở Control Panel &gt;
                            Network and Internet &gt; Network and Sharing Center
                            &gt; Change adapter settings &gt; Chuột phải vào kết
                            nối mạng &gt; Properties &gt; Chọn "Internet
                            Protocol Version 4" &gt; Properties &gt; Chọn
                            "Obtain DNS server address automatically"
                          </li>
                          <li>
                            <strong>macOS:</strong> Mở System Preferences &gt;
                            Network &gt; Chọn kết nối mạng &gt; Advanced &gt;
                            DNS &gt; Xóa tất cả các DNS servers &gt; OK &gt;
                            Apply
                          </li>
                          <li>
                            <strong>Android:</strong> Mở Settings &gt;
                            Connections &gt; Wi-Fi &gt; Nhấn giữ vào mạng Wi-Fi
                            &gt; Modify network &gt; Advanced &gt; IP settings
                            &gt; Chọn DHCP
                          </li>
                          <li>
                            <strong>iOS:</strong> Mở Settings &gt; Wi-Fi &gt;
                            Nhấn (i) bên cạnh mạng &gt; Configure DNS &gt; Chọn
                            Automatic
                          </li>
                        </ul>
                        <h4 className="font-medium text-blue-600 mb-1 mt-4">
                          Gỡ phần mềm VPN:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                          <li>
                            <strong>Windows:</strong> Mở Control Panel &gt;
                            Programs &gt; Programs and Features &gt; Tìm phần
                            mềm VPN trong danh sách &gt; Chuột phải &gt;
                            Uninstall.
                          </li>
                          <li>
                            <strong>macOS:</strong> Mở Finder &gt; Applications
                            &gt; Kéo ứng dụng VPN vào thùng rác hoặc chuột phải
                            chọn "Move to Trash". Sau đó vào System Settings
                            &gt; Network để xóa cấu hình VPN nếu còn sót.
                          </li>
                          <li>
                            <strong>Android:</strong> Mở Settings &gt; Apps &gt;
                            Tìm ứng dụng VPN &gt; Uninstall. Nếu có cấu hình VPN
                            trong Settings &gt; Network &amp; Internet &gt; VPN,
                            hãy xóa luôn.
                          </li>
                          <li>
                            <strong>iOS:</strong> Mở Settings &gt; General &gt;
                            VPN &amp; Device Management &gt; VPN &gt; Xóa cấu
                            hình VPN. Sau đó vào màn hình chính, nhấn giữ biểu
                            tượng VPN app &gt; Remove App.
                          </li>
                        </ul>
                        <h4  className="font-medium text-red-600 mb-1 mt-4">Nếu thiết bị không có cài đặt VPN/DNS tĩnh. Bạn có thể đến trường kết nối lại Wifi-Thi truy cập hệ thống kiểm tra lại.</h4>
                      </div>
                    }
                  </div>
                )}

                {networkStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Lỗi kiểm tra kết nối mạng</AlertTitle>
                    <AlertDescription>
                      Không thể kiểm tra kết nối mạng. Vui lòng đảm bảo bạn đang
                      kết nối internet và thử lại.
                    </AlertDescription>
                    <div className="mt-4">
                      <Button onClick={checkNetwork} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Thử lại
                      </Button>
                    </div>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <Button
              onClick={goToNextStep}
              // disabled={
              //   currentStep === 2
              //     ? !(cameraStatus === "success" && (showCameraPreview || cameraInitialized))
              //     : !canProceed()
              // }
              className="gap-2"
            >
              {currentStep < 4 ? (
                <>
                  Tiếp tục
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Hoàn thành
                  <Check className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Màn hình tổng kết
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <CardTitle className="text-2xl font-bold">
              Tổng Kết Kiểm Tra Thiết Bị
            </CardTitle>
            <CardDescription>
              Hệ thống đã hoàn thành việc kiểm tra các thiết bị của bạn. Dưới
              đây là kết quả chi tiết.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Thanh tiến trình hoàn thành */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Tiến trình kiểm tra</span>
                <span className="text-sm text-muted-foreground">
                  Hoàn thành 4/4
                </span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            {/* Danh sách các bước kiểm tra */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border ${
                    step.status === "success"
                      ? "bg-green-50 border-green-200"
                      : step.status === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : step.status === "error"
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {step.status === "success" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : step.status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : step.status === "error" ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ))}
            </div>

            {/* Thông tin thiết bị */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Thông tin thiết bị</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Trình duyệt</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Tên:
                      </span>
                      <p className="font-medium">{browserInfo.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Phiên bản:
                      </span>
                      <p className="font-medium">{browserInfo.version}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Hệ điều hành</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Tên:
                      </span>
                      <p className="font-medium">{osInfo.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Phiên bản:
                      </span>
                      <p className="font-medium">{osInfo.version}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {deviceType === "Desktop" ? (
                      <Laptop className="h-5 w-5 text-primary" />
                    ) : deviceType === "Mobile" ? (
                      <Smartphone className="h-5 w-5 text-primary" />
                    ) : (
                      <Tablet className="h-5 w-5 text-primary" />
                    )}
                    <h3 className="font-medium">Loại thiết bị</h3>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Thiết bị:
                    </span>
                    <p className="font-medium">{deviceType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kết quả kiểm tra camera */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Kiểm tra camera</h3>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-full ${
                      cameraStatus === "success" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Camera
                      className={`h-5 w-5 ${
                        cameraStatus === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Trạng thái camera</h4>
                    <p className="text-sm text-muted-foreground">
                      {cameraStatus === "success"
                        ? "Camera hoạt động tốt"
                        : "Camera không hoạt động hoặc có vấn đề"}
                    </p>
                  </div>
                </div>

                {capturedImage && (
                  <div className="mt-2">
                    <h4 className="font-medium mb-2">Hình ảnh đã chụp:</h4>
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <img
                        src={capturedImage || "/placeholder.svg"}
                        alt="Ảnh chụp từ camera"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Kết quả kiểm tra microphone */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Kiểm tra microphone
              </h3>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-full ${
                      microphoneStatus === "success"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Mic
                      className={`h-5 w-5 ${
                        microphoneStatus === "success"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Trạng thái microphone</h4>
                    <p className="text-sm text-muted-foreground">
                      {microphoneStatus === "success"
                        ? "Microphone hoạt động tốt"
                        : "Microphone không hoạt động hoặc có vấn đề"}
                    </p>
                  </div>
                </div>

                {audioURL && (
                  <div className="mt-2">
                    <h4 className="font-medium mb-2">Đoạn ghi âm:</h4>
                    <audio controls src={audioURL} className="w-full"></audio>
                  </div>
                )}
              </div>
            </div>

            {/* Kết quả kiểm tra mạng */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Kiểm tra mạng</h3>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-full ${
                      networkStatus === "success"
                        ? "bg-green-100"
                        : networkStatus === "warning"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Network
                      className={`h-5 w-5 ${
                        networkStatus === "success"
                          ? "text-green-500"
                          : networkStatus === "warning"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Trạng thái mạng</h4>
                    <p className="text-sm text-muted-foreground">
                      {networkStatus === "success" ? (
                        "Kết nối mạng bình thường"
                      ) : networkStatus === "warning" ? (
                        <div className="grid grid-cols-12 gap-4 items-start">
                          {/* Cột trái: 4 phần */}
                          <div className="col-span-4">
                            <p><strong>IP:</strong> {connectionIp}</p>
                            <p><strong>Downlink:</strong> {connectionDownLink} Mbps</p>
                            <p><strong>RTT:</strong> {connecttionRtt}</p>
                          </div>

                          {/* Cột phải: 8 phần */}
                          <div className="col-span-8 text-red-600">
                            <div
                              className="text-sm"
                              dangerouslySetInnerHTML={{
                                __html: networkMessage,
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        "Kết nối mạng có vấn đề"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tổng kết */}
            <div className="mb-6">
              <Alert
                className={
                  steps.every((step) => step.status === "success")
                    ? "bg-green-50 border-green-200"
                    : steps.some((step) => step.status === "error")
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }
              >
                {steps.every((step) => step.status === "success") ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : steps.some((step) => step.status === "error") ? (
                  <X className="h-4 w-4 text-red-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
                <AlertTitle
                  className={
                    steps.every((step) => step.status === "success")
                      ? "text-green-700"
                      : steps.some((step) => step.status === "error")
                      ? "text-red-700"
                      : "text-yellow-700"
                  }
                >
                  {steps.every((step) => step.status === "success")
                    ? "Thiết bị của bạn đã sẵn sàng"
                    : steps.some((step) => step.status === "error")
                    ? "Thiết bị của bạn có vấn đề"
                    : "Thiết bị của bạn có cảnh báo"}
                </AlertTitle>
                <AlertDescription
                  className={
                    steps.every((step) => step.status === "success")
                      ? "text-green-600"
                      : steps.some((step) => step.status === "error")
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {steps.every((step) => step.status === "success")
                    ? "Tất cả các thiết bị đều hoạt động tốt và sẵn sàng sử dụng."
                    : steps.some((step) => step.status === "error")
                    ? "Một số thiết bị không hoạt động đúng. Vui lòng kiểm tra lại."
                    : "Một số thiết bị có cảnh báo. Bạn vẫn có thể tiếp tục nhưng có thể gặp vấn đề."}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 border-t pt-6">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={backToCheck}
                className="gap-2 flex-1 sm:flex-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Kiểm tra lại
              </Button>
              <Button
                variant="outline"
                onClick={downloadSummary}
                className="gap-2 flex-1 sm:flex-auto"
              >
                <Download className="h-4 w-4" />
                Tải báo cáo
              </Button>
            </div>
            <Button
              className="gap-2 w-full sm:w-auto"
              onClick={saveSummaryToServer}
            >
              <Check className="h-4 w-4" />
              Xác nhận và tiếp tục
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
