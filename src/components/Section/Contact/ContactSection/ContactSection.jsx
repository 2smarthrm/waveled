 "use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const initialState = {
  nome: "",
  telefone: "",
  email: "",
  tipo: "info", // "info" | "quote"
  mensagem: "",
  // Campos extra para orçamento
  solucao: "",
  datas: "",
  local: "",
  dimensoes: "",
  orcamentoPrevisto: "",
  precisaMontagem: "sim",
  consent: false,
};

const ContactSection = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "success" | "error"

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Indica o seu nome.";
    if (!form.email.trim()) {
      e.email = "Indica o seu email.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Email inválido.";
    }
    if (!form.telefone.trim()) {
      e.telefone = "Indica um contacto telefónico.";
    } else if (!/^[\d+()\-\s]{7,}$/.test(form.telefone)) {
      e.telefone = "Telefone inválido.";
    }
    if (!form.mensagem.trim()) e.mensagem = "Escreve a tua mensagem.";
    if (!form.consent) e.consent = "É necessário consentimento para contacto.";

    if (form.tipo === "quote") {
      if (!form.solucao.trim()) e.solucao = "Seleciona a solução pretendida.";
      if (!form.datas.trim()) e.datas = "Indica datas ou período.";
      if (!form.local.trim()) e.local = "Indica o local (cidade/venue).";
      if (!form.dimensoes.trim()) e.dimensoes = "Indica dimensões/área aproximada.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("idle");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          origem: "website",
          assunto:
            form.tipo === "quote"
              ? "Pedido de orçamento - Waveled"
              : "Pedido de informação - Waveled",
        }),
      });

      if (!res.ok) throw new Error("Falha no envio");

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const showQuoteFields = form.tipo === "quote";

  return (
    <>
      <div className="section tekup-section-padding">
        <div className="container">
          <div className="row">
            {/* Bloco de conteúdo – Sobre nós */}
            <div className="col-xl-5 col-lg-6 d-flex align-items-center">
              <div className="tekup-default-content">
                <h2>Soluções LED que unem eficiência, qualidade e design moderno</h2>
                <p>
                  A <strong>Waveled</strong> é uma empresa inovadora especializada em soluções LED de{" "}
                  <em>iluminação</em> e <em>display</em>. Apoiamos marcas, eventos e espaços comerciais com projetos
                  chave-na-mão: consultoria, conceção, instalação, operação e manutenção. O nosso foco é entregar{" "}
                  <strong>impacto visual</strong>, <strong>eficiência energética</strong> e <strong>fiabilidade</strong>.
                </p>

                <div className="tekup-contact-info-wrap wrap2">
                  <div className="tekup-contact-info mb-0">
                    <i className="ri-map-pin-2-fill" aria-hidden="true"></i>
                    <h5>Endereço</h5>
                    <p>
                      Rua Fernando Farinha nº 2A e 2B
                      <br />
                      Braço de Prata, 1950-448 Lisboa
                    </p>
                  </div>
                  <div className="tekup-contact-info mb-0">
                    <i className="ri-mail-fill" aria-hidden="true"></i>
                    <h5>Contactos</h5>
                    <p className="mb-1">
                      <Link href="mailto:geral@waveled.pt">geral@waveled.pt</Link>
                    </p>
                    <p className="mb-0">
                      <Link href="tel:+351210353555">+351 210 353 555</Link>
                    </p>
                  </div>
                </div>
                <br />
                  <div className="image-area">
                     <img   src="https://vortexhire.co.uk/wp-content/uploads/2023/04/Transparent-LED-Screen-curved-office.jpg" alt="" />
                  </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="col-xl-6 offset-xl-1 col-lg-6">
              <div className="tekup-main-form">
                <h3>Fala connosco</h3>
                <p>Escolhe o tipo de mensagem e descreve o que precisas.</p>

                {status === "success" && (
                  <div className="alert alert-success" role="alert" aria-live="polite">
                    Obrigado! Recebemos a tua mensagem e entraremos em contacto brevemente.
                  </div>
                )}
                {status === "error" && (
                  <div className="alert alert-danger" role="alert" aria-live="polite">
                    Ocorreu um problema ao enviar. Tenta novamente, por favor.
                  </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="tekup-main-field">
                        <label htmlFor="tipo" className="form-label">
                          Tipo de mensagem <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="tipo"
                          name="tipo"
                          value={form.tipo}
                          onChange={onChange}
                          className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
                          aria-invalid={!!errors.tipo}
                        >
                          <option value="info">Pedido de informação</option>
                          <option value="quote">Pedido de orçamento</option>
                        </select>
                        {errors.tipo && <div className="invalid-feedback">{errors.tipo}</div>}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="tekup-main-field">
                        <label htmlFor="nome" className="form-label">
                          Nome <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="nome"
                          name="nome"
                          type="text"
                          placeholder="O seu nome"
                          value={form.nome}
                          onChange={onChange}
                          className={errors.nome ? "is-invalid" : ""}
                          aria-invalid={!!errors.nome}
                        />
                        {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="tekup-main-field">
                        <label htmlFor="telefone" className="form-label">
                          Telefone <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="telefone"
                          name="telefone"
                          type="tel"
                          inputMode="tel"
                          placeholder="+351 9xx xxx xxx"
                          value={form.telefone}
                          onChange={onChange}
                          className={errors.telefone ? "is-invalid" : ""}
                          aria-invalid={!!errors.telefone}
                        />
                        {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="tekup-main-field">
                        <label htmlFor="email" className="form-label">
                          Email <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="geral@waveled.pt"
                          value={form.email}
                          onChange={onChange}
                          className={errors.email ? "is-invalid" : ""}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    {/* Campos específicos para orçamento */}
                    {showQuoteFields && (
                      <>
                        <div className="col-lg-12">
                          <div className="tekup-main-field">
                            <label htmlFor="solucao" className="form-label">
                              Solução pretendida <span aria-hidden="true">*</span>
                            </label>
                            <select
                              id="solucao"
                              name="solucao"
                              value={form.solucao}
                              onChange={onChange}
                              className={`form-select ${errors.solucao ? "is-invalid" : ""}`}
                              aria-invalid={!!errors.solucao}
                            >
                              <option value="">Seleciona uma opção</option>
                              <option value="led-rental">Aluguer de painéis LED (eventos)</option>
                              <option value="led-fixed">Instalação fixa (lojas/empresas)</option>
                              <option value="led-iluminacao">Iluminação LED (arquitetural/industrial)</option>
                              <option value="outro">Outra solução</option>
                            </select>
                            {errors.solucao && <div className="invalid-feedback">{errors.solucao}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="datas" className="form-label">
                              Datas / Período <span aria-hidden="true">*</span>
                            </label>
                            <input
                              id="datas"
                              name="datas"
                              type="text"
                              placeholder="Ex.: 12–14 de Outubro ou mês previsto"
                              value={form.datas}
                              onChange={onChange}
                              className={errors.datas ? "is-invalid" : ""}
                              aria-invalid={!!errors.datas}
                            />
                            {errors.datas && <div className="invalid-feedback">{errors.datas}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="local" className="form-label">
                              Local <span aria-hidden="true">*</span>
                            </label>
                            <input
                              id="local"
                              name="local"
                              type="text"
                              placeholder="Cidade / Venue"
                              value={form.local}
                              onChange={onChange}
                              className={errors.local ? "is-invalid" : ""}
                              aria-invalid={!!errors.local}
                            />
                            {errors.local && <div className="invalid-feedback">{errors.local}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="dimensoes" className="form-label">
                              Dimensões / Área <span aria-hidden="true">*</span>
                            </label>
                            <input
                              id="dimensoes"
                              name="dimensoes"
                              type="text"
                              placeholder="Ex.: 4m × 2m, 8 m², pitch desejado"
                              value={form.dimensoes}
                              onChange={onChange}
                              className={errors.dimensoes ? "is-invalid" : ""}
                              aria-invalid={!!errors.dimensoes}
                            />
                            {errors.dimensoes && <div className="invalid-feedback">{errors.dimensoes}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="orcamentoPrevisto" className="form-label">
                              Orçamento previsto (opcional)
                            </label>
                            <input
                              id="orcamentoPrevisto"
                              name="orcamentoPrevisto"
                              type="text"
                              placeholder="Ex.: até 3.000 €"
                              value={form.orcamentoPrevisto}
                              onChange={onChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="tekup-main-field">
                            <label className="form-label d-block">Necessita de montagem/operadores?</label>
                            <div className="d-flex gap-3">
                              <label className="d-inline-flex align-items-center gap-2">
                                <input
                                  type="radio"
                                  name="precisaMontagem"
                                  value="sim"
                                  checked={form.precisaMontagem === "sim"}
                                  onChange={onChange}
                                />
                                <span>Sim</span>
                              </label>
                              <label className="d-inline-flex align-items-center gap-2">
                                <input
                                  type="radio"
                                  name="precisaMontagem"
                                  value="nao"
                                  checked={form.precisaMontagem === "nao"}
                                  onChange={onChange}
                                />
                                <span>Não</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-lg-12">
                      <div className="tekup-main-field">
                        <label htmlFor="mensagem" className="form-label">
                          Mensagem <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="mensagem"
                          name="mensagem"
                          placeholder={
                            showQuoteFields
                              ? "Descreve o projeto (tipo de conteúdo, distância de visualização, horários, etc.)"
                              : "Como podemos ajudar?"
                          }
                          value={form.mensagem}
                          onChange={onChange}
                          rows={5}
                          className={errors.mensagem ? "is-invalid" : ""}
                          aria-invalid={!!errors.mensagem}
                        />
                        {errors.mensagem && <div className="invalid-feedback">{errors.mensagem}</div>}
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="tekup-main-field d-flex align-items-start gap-2">
                        <input
                          id="consent"
                          name="consent"
                          type="checkbox"
                          checked={form.consent}
                          onChange={onChange}
                          aria-invalid={!!errors.consent}
                        />
                        <label htmlFor="consent" className="form-label mb-0">
                          Autorizo a Waveled a contactar-me para responder a este pedido. Li e aceito a{" "}
                          <Link href="/politica-de-privacidade" target="_blank">
                            Política de Privacidade
                          </Link>
                          .
                        </label>
                      </div>
                      {errors.consent && <div className="invalid-feedback d-block">{errors.consent}</div>}
                    </div>

                    <div className="col-lg-12">
                      <button
                        id="tekup-main-form-btn"
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                      >
                        {submitting ? (
                          <>
                            A enviar… <i className="ri-loader-4-line" aria-hidden="true"></i>
                          </>
                        ) : (
                          <>
                            Enviar mensagem <i className="ri-arrow-right-up-line" aria-hidden="true"></i>
                          </>
                        )}
                      </button>
                      <p className="mt-2 small text-muted">
                        Não enviamos spam. Usamos os teus dados apenas para dar seguimento ao pedido.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSection;
