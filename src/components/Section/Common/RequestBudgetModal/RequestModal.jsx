"use client";

import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Link from "next/link";

const isBrowser = typeof window !== "undefined";
const protocol =
  isBrowser && window.location.protocol === "https:" ? "https" : "http";
const BaseUrl =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";

const PHONE_DIGITS_MIN = 9;
const PHONE_DIGITS_MAX = 15;
const onlyDigitsPlus = (s) => s.replace(/[^\d+]/g, "");
const countDigits = (s) => (s.match(/\d/g) ?? []).length;

export default function RequestModal({ item, toggle_button }) {
  const [show, setShow] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const openModal = () => setShow(true);
  const closeModal = () => {
    if (!submitting) setShow(false);
  };
 
  useEffect(() => {
    if (show && item) {
      setNome("");
      setEmail("");
      setTelefone("");
      setDescricao("");
      setFeedback({ type: "idle", message: "" });
      setSubmitting(false);
    }
  }, [show, item]);

  if (!item) return null;

  const imageSrc =
    item?.wl_images?.length > 0
      ? item?.wl_images[0].startsWith("http")
        ? item?.wl_images[0]
        : BaseUrl + item?.wl_images[0]
      : "";

  /* ----------------- SUBMIT ----------------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "idle", message: "" });
 
    if (!nome.trim() || !email.trim() || !telefone.trim() || !descricao.trim()) {
      setFeedback({
        type: "error",
        message:
          "Por favor, preencha o nome, o email, o telefone e a descrição !",
      });
      return;
    }

    const descLen = descricao.trim().length;
    if (descLen > 1500) {
      setFeedback({
        type: "error",
        message: "A descrição deve ter no máximo 1500 caracteres !",
      });
      return;
    }

    const digits = countDigits(telefone);
    if (digits < PHONE_DIGITS_MIN || digits > PHONE_DIGITS_MAX) {
      setFeedback({
        type: "error",
        message: "Telefone inválido. Utilize entre 9 e 15 dígitos !",
      });
      return;
    }

    const normalizedPhone = onlyDigitsPlus(telefone).replace(
      /(\+\d{2,3})(\d+)/,
      "$1 $2"
    );

    setSubmitting(true);

    try {
      const produtoUrl =
        isBrowser && item?._id
          ? `${window.location.origin}/single-shop?product=${item?._id}`
          : "";

      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        telefone: normalizedPhone,
        descricao: descricao, // curta (<= 50 chars)
        produtoId: item?._id,
        produtoNome: item?.wl_name,
        produtoCategoria: item?.wl_category?.wl_name || "",
        produtoImagem: imageSrc || "",
        produtoUrl,
        origem: "modal-orcamento",
        page: isBrowser ? window.location.pathname || "" : "",
        utm: null,
      };

      const res = await fetch(`${BaseUrl}/api/public/project-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      console.clear();
      console.log(json);
      console.log("########################## Payload ############################");
      console.log(payload);

      if (!res.ok || !json?.ok) {
        setFeedback({
          type: "error",
          message:
            json?.message ||
            "Não foi possível enviar a solicitação de projeto. Por favor, tente novamente !",
        });
        setSubmitting(false);
        return;
      }

      setFeedback({
        type: "success",
        message:
          json?.message ||
          "A sua solicitação de projeto foi enviada com sucesso. Entraremos em contacto consigo brevemente !",
      });

      setSubmitting(false);
    } catch (err) {
      console.error("[RequestModal] Erro:", err);
      setFeedback({
        type: "error",
        message:
          "Ocorreu um erro inesperado. Verifique a sua ligação e tente novamente !",
      });
      setSubmitting(false);
    }
  };

  /* ----------------- RENDER ----------------- */
  return (
    <>
      {/* Botão que abre o modal */}
      {typeof toggle_button === "function" && toggle_button(openModal)}

      <Modal show={show} onHide={closeModal} centered size="lg" backdrop="static">
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Pedido de orçamento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            {/* ----------------- Imagem + Infos ----------------- */}
            <div className="col-lg-5 mb-3">
              <div
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item?.wl_name}
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-center p-4">Imagem não disponível.</div>
                )}
              </div> 
              <h5 className="mt-3 mb-1">{item?.wl_name}</h5>
              <Link
                href={`single-shop?product=${item?._id}`}
                className="small"
              >
                Ver detalhes completos deste produto
              </Link>

              {item?.wl_specs_text && (
                <p style={{ fontSize: "14px" }}>
                  {item?.wl_specs_text.split("").length > 140
                    ? item?.wl_specs_text?.substring(0, 140) + "..."
                    : item?.wl_specs_text}
                </p>
              )}
            </div>

            {/* ----------------- Formulário ----------------- */}
            <div className="col-lg-7">
              {feedback.type === "success" && (
                <div className="alert alert-success">{feedback.message}</div>
              )}
              {feedback.type === "error" && (
                <div className="alert alert-danger">{feedback.message}</div>
              )}

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Nome <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="O seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="o.seu.email@empresa.pt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Telefone <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+351 9xx xxx xxx"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Descrição  do projeto{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    maxLength={1000}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    disabled={submitting}
                    placeholder="Ex.: Painel LED para montra de loja."
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    className="tekup-default-btn"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "A enviar..." : "Enviar pedido"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
