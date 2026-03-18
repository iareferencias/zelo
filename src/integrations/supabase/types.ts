export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      campanha_disponibilidade: {
        Row: {
          active: boolean | null
          campanha_id: number
          criado_em: string | null
          day_of_week: number
          id: number
          is_kids: boolean | null
          time: string
        }
        Insert: {
          active?: boolean | null
          campanha_id: number
          criado_em?: string | null
          day_of_week: number
          id?: number
          is_kids?: boolean | null
          time: string
        }
        Update: {
          active?: boolean | null
          campanha_id?: number
          criado_em?: string | null
          day_of_week?: number
          id?: number
          is_kids?: boolean | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanha_disponibilidade_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas: {
        Row: {
          ativa: boolean
          atualizado_em: string
          criado_em: string
          descricao: string
          dias_disponiveis: Json | null
          duracao_atendimento: number | null
          emails_notificacao: Json | null
          empresa_id: number
          horarios_disponiveis: Json | null
          id: number
          link_form_unico: string
          nome: string
          percentual_comissao: number
          permitir_anexo: boolean
          preco: number
          texto_agendamento: string | null
          usar_agendamento: boolean
        }
        Insert: {
          ativa?: boolean
          atualizado_em: string
          criado_em?: string
          descricao: string
          dias_disponiveis?: Json | null
          duracao_atendimento?: number | null
          emails_notificacao?: Json | null
          empresa_id: number
          horarios_disponiveis?: Json | null
          id?: number
          link_form_unico: string
          nome: string
          percentual_comissao: number
          permitir_anexo?: boolean
          preco: number
          texto_agendamento?: string | null
          usar_agendamento?: boolean
        }
        Update: {
          ativa?: boolean
          atualizado_em?: string
          criado_em?: string
          descricao?: string
          dias_disponiveis?: Json | null
          duracao_atendimento?: number | null
          emails_notificacao?: Json | null
          empresa_id?: number
          horarios_disponiveis?: Json | null
          id?: number
          link_form_unico?: string
          nome?: string
          percentual_comissao?: number
          permitir_anexo?: boolean
          preco?: number
          texto_agendamento?: string | null
          usar_agendamento?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      click_tracking: {
        Row: {
          campanha_id: number
          criado_em: string
          id: number
          ip_address: string
          referenciador_id: number | null
          user_agent: string | null
        }
        Insert: {
          campanha_id: number
          criado_em?: string
          id?: number
          ip_address: string
          referenciador_id?: number | null
          user_agent?: string | null
        }
        Update: {
          campanha_id?: number
          criado_em?: string
          id?: number
          ip_address?: string
          referenciador_id?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "click_tracking_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "click_tracking_referenciador_id_fkey"
            columns: ["referenciador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cupons: {
        Row: {
          atualizado_em: string
          categoria: Database["public"]["Enums"]["CategoriaCupom"]
          codigo: string
          criado_em: string
          duracao_desconto: Database["public"]["Enums"]["DuracaoDesconto"]
          duracao_meses: number | null
          id: number
          limite_usos: number | null
          mensagem_personalizada: string | null
          nome_interno: string
          status: Database["public"]["Enums"]["StatusCupom"]
          tipo: Database["public"]["Enums"]["TipoCupom"]
          usos_atuais: number
          validade: string | null
          valor: number
        }
        Insert: {
          atualizado_em: string
          categoria: Database["public"]["Enums"]["CategoriaCupom"]
          codigo: string
          criado_em?: string
          duracao_desconto?: Database["public"]["Enums"]["DuracaoDesconto"]
          duracao_meses?: number | null
          id?: number
          limite_usos?: number | null
          mensagem_personalizada?: string | null
          nome_interno: string
          status?: Database["public"]["Enums"]["StatusCupom"]
          tipo: Database["public"]["Enums"]["TipoCupom"]
          usos_atuais?: number
          validade?: string | null
          valor: number
        }
        Update: {
          atualizado_em?: string
          categoria?: Database["public"]["Enums"]["CategoriaCupom"]
          codigo?: string
          criado_em?: string
          duracao_desconto?: Database["public"]["Enums"]["DuracaoDesconto"]
          duracao_meses?: number | null
          id?: number
          limite_usos?: number | null
          mensagem_personalizada?: string | null
          nome_interno?: string
          status?: Database["public"]["Enums"]["StatusCupom"]
          tipo?: Database["public"]["Enums"]["TipoCupom"]
          usos_atuais?: number
          validade?: string | null
          valor?: number
        }
        Relationships: []
      }
      empresas: {
        Row: {
          administrador_id: number
          atualizado_em: string
          cnpj: string
          criado_em: string
          email_contato: string | null
          endereco: string | null
          id: number
          logo_url: string | null
          nome: string
          telefone: string | null
        }
        Insert: {
          administrador_id: number
          atualizado_em: string
          cnpj: string
          criado_em?: string
          email_contato?: string | null
          endereco?: string | null
          id?: number
          logo_url?: string | null
          nome: string
          telefone?: string | null
        }
        Update: {
          administrador_id?: number
          atualizado_em?: string
          cnpj?: string
          criado_em?: string
          email_contato?: string | null
          endereco?: string | null
          id?: number
          logo_url?: string | null
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_administrador_id_fkey"
            columns: ["administrador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      experimental_time_slots: {
        Row: {
          active: boolean
          criado_em: string
          day_of_week: number
          id: number
          time: string
        }
        Insert: {
          active?: boolean
          criado_em?: string
          day_of_week: number
          id?: number
          time: string
        }
        Update: {
          active?: boolean
          criado_em?: string
          day_of_week?: number
          id?: number
          time?: string
        }
        Relationships: []
      }
      influencer_post_validations: {
        Row: {
          criado_em: string
          descricao_prova: string | null
          id: number
          ip_primeiro_clique: string | null
          motivo_rejeicao: string | null
          primeiro_clique: string | null
          rejeitado: boolean
          rejeitado_em: string | null
          tipo_validacao: Database["public"]["Enums"]["TipoValidacaoInfluencer"]
          upload_em: string | null
          url_prova: string | null
          validado: boolean
          validado_em: string | null
          validado_por_id: number | null
          weekly_link_id: number
        }
        Insert: {
          criado_em?: string
          descricao_prova?: string | null
          id?: number
          ip_primeiro_clique?: string | null
          motivo_rejeicao?: string | null
          primeiro_clique?: string | null
          rejeitado?: boolean
          rejeitado_em?: string | null
          tipo_validacao: Database["public"]["Enums"]["TipoValidacaoInfluencer"]
          upload_em?: string | null
          url_prova?: string | null
          validado?: boolean
          validado_em?: string | null
          validado_por_id?: number | null
          weekly_link_id: number
        }
        Update: {
          criado_em?: string
          descricao_prova?: string | null
          id?: number
          ip_primeiro_clique?: string | null
          motivo_rejeicao?: string | null
          primeiro_clique?: string | null
          rejeitado?: boolean
          rejeitado_em?: string | null
          tipo_validacao?: Database["public"]["Enums"]["TipoValidacaoInfluencer"]
          upload_em?: string | null
          url_prova?: string | null
          validado?: boolean
          validado_em?: string | null
          validado_por_id?: number | null
          weekly_link_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "influencer_post_validations_weekly_link_id_fkey"
            columns: ["weekly_link_id"]
            isOneToOne: false
            referencedRelation: "influencer_weekly_links"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_weekly_compliance: {
        Row: {
          atualizado_em: string
          campanha_id: number
          clicks_recebidos: number
          criado_em: string
          id: number
          leads_gerados: number
          link_gerado: boolean
          link_gerado_em: string | null
          postagem_validada: boolean
          postagem_validada_em: string | null
          representacao_id: number
          semana_fechada: boolean
          semana_fechada_em: string | null
          semana_fim: string
          semana_inicio: string
          status: Database["public"]["Enums"]["StatusComplianceInfluencer"]
        }
        Insert: {
          atualizado_em: string
          campanha_id: number
          clicks_recebidos?: number
          criado_em?: string
          id?: number
          leads_gerados?: number
          link_gerado?: boolean
          link_gerado_em?: string | null
          postagem_validada?: boolean
          postagem_validada_em?: string | null
          representacao_id: number
          semana_fechada?: boolean
          semana_fechada_em?: string | null
          semana_fim: string
          semana_inicio: string
          status?: Database["public"]["Enums"]["StatusComplianceInfluencer"]
        }
        Update: {
          atualizado_em?: string
          campanha_id?: number
          clicks_recebidos?: number
          criado_em?: string
          id?: number
          leads_gerados?: number
          link_gerado?: boolean
          link_gerado_em?: string | null
          postagem_validada?: boolean
          postagem_validada_em?: string | null
          representacao_id?: number
          semana_fechada?: boolean
          semana_fechada_em?: string | null
          semana_fim?: string
          semana_inicio?: string
          status?: Database["public"]["Enums"]["StatusComplianceInfluencer"]
        }
        Relationships: [
          {
            foreignKeyName: "influencer_weekly_compliance_representacao_id_fkey"
            columns: ["representacao_id"]
            isOneToOne: false
            referencedRelation: "representacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_weekly_links: {
        Row: {
          campanha_id: number
          clicks_recebidos: number
          gerado_em: string
          id: number
          link_gerado: string
          representacao_id: number
          semana_fim: string
          semana_inicio: string
          tipo_validacao:
            | Database["public"]["Enums"]["TipoValidacaoInfluencer"]
            | null
          validado: boolean
          validado_em: string | null
        }
        Insert: {
          campanha_id: number
          clicks_recebidos?: number
          gerado_em?: string
          id?: number
          link_gerado: string
          representacao_id: number
          semana_fim: string
          semana_inicio: string
          tipo_validacao?:
            | Database["public"]["Enums"]["TipoValidacaoInfluencer"]
            | null
          validado?: boolean
          validado_em?: string | null
        }
        Update: {
          campanha_id?: number
          clicks_recebidos?: number
          gerado_em?: string
          id?: number
          link_gerado?: string
          representacao_id?: number
          semana_fim?: string
          semana_inicio?: string
          tipo_validacao?:
            | Database["public"]["Enums"]["TipoValidacaoInfluencer"]
            | null
          validado?: boolean
          validado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_weekly_links_representacao_id_fkey"
            columns: ["representacao_id"]
            isOneToOne: false
            referencedRelation: "representacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_historico: {
        Row: {
          acao: string
          criado_em: string
          id: number
          lead_id: number
          observacao: string | null
          status_anterior: string | null
          status_novo: string | null
          usuario_id: number
          usuario_nome: string
        }
        Insert: {
          acao: string
          criado_em?: string
          id?: number
          lead_id: number
          observacao?: string | null
          status_anterior?: string | null
          status_novo?: string | null
          usuario_id: number
          usuario_nome: string
        }
        Update: {
          acao?: string
          criado_em?: string
          id?: number
          lead_id?: number
          observacao?: string | null
          status_anterior?: string | null
          status_novo?: string | null
          usuario_id?: number
          usuario_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_historico_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          approved_at: string | null
          arquivo_anexo: string | null
          atualizado_em: string
          campanha_id: number
          closed_value: number | null
          commission_paid_at: string | null
          commission_released_at: string | null
          commission_status: Database["public"]["Enums"]["CommissionStatus"]
          commission_value: number
          criado_em: string
          email: string
          horario_agendado: string | null
          id: number
          instagram_indicado: string | null
          is_interno: boolean
          is_perdido: boolean
          motivo_perdido: string | null
          nome: string
          obs_interna: string | null
          observacao: string | null
          payment_received_at: string | null
          payment_status: Database["public"]["Enums"]["PaymentStatus"]
          perdido_em: string | null
          preferencia_horario: string | null
          referenciador_id: number | null
          status: Database["public"]["Enums"]["StatusLead"]
          status_comercial: Database["public"]["Enums"]["StatusComercial"]
          status_financeiro: Database["public"]["Enums"]["StatusFinanceiro"]
          telefone: string
          tipo_lead: Database["public"]["Enums"]["TipoLead"]
          whatsapp_indicado: string | null
        }
        Insert: {
          approved_at?: string | null
          arquivo_anexo?: string | null
          atualizado_em: string
          campanha_id: number
          closed_value?: number | null
          commission_paid_at?: string | null
          commission_released_at?: string | null
          commission_status?: Database["public"]["Enums"]["CommissionStatus"]
          commission_value?: number
          criado_em?: string
          email: string
          horario_agendado?: string | null
          id?: number
          instagram_indicado?: string | null
          is_interno?: boolean
          is_perdido?: boolean
          motivo_perdido?: string | null
          nome: string
          obs_interna?: string | null
          observacao?: string | null
          payment_received_at?: string | null
          payment_status?: Database["public"]["Enums"]["PaymentStatus"]
          perdido_em?: string | null
          preferencia_horario?: string | null
          referenciador_id?: number | null
          status?: Database["public"]["Enums"]["StatusLead"]
          status_comercial?: Database["public"]["Enums"]["StatusComercial"]
          status_financeiro?: Database["public"]["Enums"]["StatusFinanceiro"]
          telefone: string
          tipo_lead?: Database["public"]["Enums"]["TipoLead"]
          whatsapp_indicado?: string | null
        }
        Update: {
          approved_at?: string | null
          arquivo_anexo?: string | null
          atualizado_em?: string
          campanha_id?: number
          closed_value?: number | null
          commission_paid_at?: string | null
          commission_released_at?: string | null
          commission_status?: Database["public"]["Enums"]["CommissionStatus"]
          commission_value?: number
          criado_em?: string
          email?: string
          horario_agendado?: string | null
          id?: number
          instagram_indicado?: string | null
          is_interno?: boolean
          is_perdido?: boolean
          motivo_perdido?: string | null
          nome?: string
          obs_interna?: string | null
          observacao?: string | null
          payment_received_at?: string | null
          payment_status?: Database["public"]["Enums"]["PaymentStatus"]
          perdido_em?: string | null
          preferencia_horario?: string | null
          referenciador_id?: number | null
          status?: Database["public"]["Enums"]["StatusLead"]
          status_comercial?: Database["public"]["Enums"]["StatusComercial"]
          status_financeiro?: Database["public"]["Enums"]["StatusFinanceiro"]
          telefone?: string
          tipo_lead?: Database["public"]["Enums"]["TipoLead"]
          whatsapp_indicado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_referenciador_id_fkey"
            columns: ["referenciador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_admin: {
        Row: {
          acao: string
          admin_id: number
          campanha_id: number | null
          campanha_nome: string | null
          criado_em: string
          detalhes: string | null
          id: number
          lead_id: number | null
          representacao_id: number | null
          usuario_envolvido_id: number | null
          usuario_envolvido_nome: string | null
          valor_comissao: number | null
        }
        Insert: {
          acao: string
          admin_id: number
          campanha_id?: number | null
          campanha_nome?: string | null
          criado_em?: string
          detalhes?: string | null
          id?: number
          lead_id?: number | null
          representacao_id?: number | null
          usuario_envolvido_id?: number | null
          usuario_envolvido_nome?: string | null
          valor_comissao?: number | null
        }
        Update: {
          acao?: string
          admin_id?: number
          campanha_id?: number | null
          campanha_nome?: string | null
          criado_em?: string
          detalhes?: string | null
          id?: number
          lead_id?: number | null
          representacao_id?: number | null
          usuario_envolvido_id?: number | null
          usuario_envolvido_nome?: string | null
          valor_comissao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_admin_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string | null
          role: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string | null
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          criada_em: string
          dados: Json | null
          id: number
          lida: boolean
          lida_em: string | null
          link_acao: string | null
          mensagem: string
          tipo: Database["public"]["Enums"]["TipoNotificacao"]
          titulo: string
          usuario_id: number
        }
        Insert: {
          criada_em?: string
          dados?: Json | null
          id?: number
          lida?: boolean
          lida_em?: string | null
          link_acao?: string | null
          mensagem: string
          tipo?: Database["public"]["Enums"]["TipoNotificacao"]
          titulo: string
          usuario_id: number
        }
        Update: {
          criada_em?: string
          dados?: Json | null
          id?: number
          lida?: boolean
          lida_em?: string | null
          link_acao?: string | null
          mensagem?: string
          tipo?: Database["public"]["Enums"]["TipoNotificacao"]
          titulo?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          name: string | null
          repository_url: string | null
          status: string | null
          supabase_project_id: string | null
          user_id: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          repository_url?: string | null
          status?: string | null
          supabase_project_id?: string | null
          user_id?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          repository_url?: string | null
          status?: string | null
          supabase_project_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      representacoes: {
        Row: {
          aprovado_em: string | null
          desativado_em: string | null
          desativado_por_id: number | null
          empresa_id: number
          excluido: boolean
          excluido_em: string | null
          excluido_por_id: number | null
          id: number
          influencer_ativado_em: string | null
          influencer_ativado_por_id: number | null
          modo_influencer: boolean
          motivo_desativacao: string | null
          motivo_exclusao: string | null
          motivo_rejeicao: string | null
          reativado_em: string | null
          reativado_por_id: number | null
          rejeitado_em: string | null
          solicitado_em: string
          status: Database["public"]["Enums"]["StatusRepresentacao"]
          status_ativo: boolean
          usuario_id: number
        }
        Insert: {
          aprovado_em?: string | null
          desativado_em?: string | null
          desativado_por_id?: number | null
          empresa_id: number
          excluido?: boolean
          excluido_em?: string | null
          excluido_por_id?: number | null
          id?: number
          influencer_ativado_em?: string | null
          influencer_ativado_por_id?: number | null
          modo_influencer?: boolean
          motivo_desativacao?: string | null
          motivo_exclusao?: string | null
          motivo_rejeicao?: string | null
          reativado_em?: string | null
          reativado_por_id?: number | null
          rejeitado_em?: string | null
          solicitado_em?: string
          status?: Database["public"]["Enums"]["StatusRepresentacao"]
          status_ativo?: boolean
          usuario_id: number
        }
        Update: {
          aprovado_em?: string | null
          desativado_em?: string | null
          desativado_por_id?: number | null
          empresa_id?: number
          excluido?: boolean
          excluido_em?: string | null
          excluido_por_id?: number | null
          id?: number
          influencer_ativado_em?: string | null
          influencer_ativado_por_id?: number | null
          modo_influencer?: boolean
          motivo_desativacao?: string | null
          motivo_exclusao?: string | null
          motivo_rejeicao?: string | null
          reativado_em?: string | null
          reativado_por_id?: number | null
          rejeitado_em?: string | null
          solicitado_em?: string
          status?: Database["public"]["Enums"]["StatusRepresentacao"]
          status_ativo?: boolean
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "representacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "representacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      uso_cupom: {
        Row: {
          criado_em: string
          cupom_id: number
          email: string | null
          id: number
          usuario_id: number | null
          valor_desconto: number
        }
        Insert: {
          criado_em?: string
          cupom_id: number
          email?: string | null
          id?: number
          usuario_id?: number | null
          valor_desconto: number
        }
        Update: {
          criado_em?: string
          cupom_id?: number
          email?: string | null
          id?: number
          usuario_id?: number | null
          valor_desconto?: number
        }
        Relationships: [
          {
            foreignKeyName: "uso_cupom_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          account_holder_name: string | null
          assinatura_ativa: boolean
          assinatura_cancelada: boolean | null
          assinatura_id: string | null
          atualizado_em: string
          bank_account_number: string | null
          bank_account_type: string | null
          bank_agency: string | null
          bank_data_completed: boolean | null
          bank_name: string | null
          cancelamento_data: string | null
          cancelamento_tipo: string | null
          cancelamento_valido_ate: string | null
          conta_excluida: boolean
          conta_excluida_em: string | null
          criado_em: string
          email: string
          email_confirmado: boolean
          id: number
          media_kit_url: string | null
          nome: string
          pausada_ate: string | null
          perfil: string | null
          pix_key: string | null
          plano: Database["public"]["Enums"]["TipoPlano"]
          proximo_pagamento: string | null
          role: Database["public"]["Enums"]["Role"]
          senha_hash: string
          telefone: string | null
          tipo_referenciador:
            | Database["public"]["Enums"]["TipoReferenciador"]
            | null
          token_confirmacao: string | null
          token_expira_em: string | null
          token_reset_expira_em: string | null
          token_reset_senha: string | null
          trial_fim: string | null
          trial_inicio: string | null
          ultimo_acesso: string | null
        }
        Insert: {
          account_holder_name?: string | null
          assinatura_ativa?: boolean
          assinatura_cancelada?: boolean | null
          assinatura_id?: string | null
          atualizado_em: string
          bank_account_number?: string | null
          bank_account_type?: string | null
          bank_agency?: string | null
          bank_data_completed?: boolean | null
          bank_name?: string | null
          cancelamento_data?: string | null
          cancelamento_tipo?: string | null
          cancelamento_valido_ate?: string | null
          conta_excluida?: boolean
          conta_excluida_em?: string | null
          criado_em?: string
          email: string
          email_confirmado?: boolean
          id?: number
          media_kit_url?: string | null
          nome: string
          pausada_ate?: string | null
          perfil?: string | null
          pix_key?: string | null
          plano?: Database["public"]["Enums"]["TipoPlano"]
          proximo_pagamento?: string | null
          role?: Database["public"]["Enums"]["Role"]
          senha_hash: string
          telefone?: string | null
          tipo_referenciador?:
            | Database["public"]["Enums"]["TipoReferenciador"]
            | null
          token_confirmacao?: string | null
          token_expira_em?: string | null
          token_reset_expira_em?: string | null
          token_reset_senha?: string | null
          trial_fim?: string | null
          trial_inicio?: string | null
          ultimo_acesso?: string | null
        }
        Update: {
          account_holder_name?: string | null
          assinatura_ativa?: boolean
          assinatura_cancelada?: boolean | null
          assinatura_id?: string | null
          atualizado_em?: string
          bank_account_number?: string | null
          bank_account_type?: string | null
          bank_agency?: string | null
          bank_data_completed?: boolean | null
          bank_name?: string | null
          cancelamento_data?: string | null
          cancelamento_tipo?: string | null
          cancelamento_valido_ate?: string | null
          conta_excluida?: boolean
          conta_excluida_em?: string | null
          criado_em?: string
          email?: string
          email_confirmado?: boolean
          id?: number
          media_kit_url?: string | null
          nome?: string
          pausada_ate?: string | null
          perfil?: string | null
          pix_key?: string | null
          plano?: Database["public"]["Enums"]["TipoPlano"]
          proximo_pagamento?: string | null
          role?: Database["public"]["Enums"]["Role"]
          senha_hash?: string
          telefone?: string | null
          tipo_referenciador?:
            | Database["public"]["Enums"]["TipoReferenciador"]
            | null
          token_confirmacao?: string | null
          token_expira_em?: string | null
          token_reset_expira_em?: string | null
          token_reset_senha?: string | null
          trial_fim?: string | null
          trial_inicio?: string | null
          ultimo_acesso?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      sms_templates: {
        Row: {
          conteudo: string | null
          created_at: string | null
          id: string | null
          nome: string | null
          owner_user_id: string | null
        }
        Insert: {
          conteudo?: string | null
          created_at?: string | null
          id?: string | null
          nome?: string | null
          owner_user_id?: string | null
        }
        Update: {
          conteudo?: string | null
          created_at?: string | null
          id?: string | null
          nome?: string | null
          owner_user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      exec_sql: { Args: { query: string }; Returns: undefined }
      exec_sql_query: { Args: { query: string }; Returns: Json }
    }
    Enums: {
      app_role: "owner" | "admin" | "member" | "super_admin"
      CategoriaCupom: "INTERNO" | "PUBLICO"
      CommissionStatus: "BLOQUEADA" | "LIBERADA" | "PAGA"
      DuracaoDesconto: "UMA_VEZ" | "REPETICAO" | "PARA_SEMPRE"
      PaymentStatus: "NAO_PAGO" | "PAGO" | "PARCIAL"
      Role: "ADMIN" | "REFERENCIADOR" | "SUPERMASTER"
      StatusComercial:
        | "NOVO"
        | "EM_CONTATO"
        | "NEGOCIACAO"
        | "FECHADO"
        | "COMERCIAL_FINALIZADO"
        | "AGUARDANDO_CONVITE"
      StatusComplianceInfluencer:
        | "EM_ANDAMENTO"
        | "OK"
        | "FALHA"
        | "PENDENTE_VALIDACAO"
      StatusCupom: "ATIVO" | "PAUSADO" | "EXPIRADO"
      StatusFinanceiro:
        | "AGUARDANDO_PAGAMENTO"
        | "PAGO"
        | "COMISSAO_LIBERADA"
        | "FINANCEIRO_FINALIZADO"
      StatusLead: "PENDENTE" | "APROVADO" | "REJEITADO"
      StatusRepresentacao: "PENDENTE" | "APROVADO" | "REJEITADO"
      TipoCupom: "PERCENTUAL" | "VALOR_FIXO"
      TipoLead: "NORMAL" | "INDICACAO_SUGERIDA"
      TipoNotificacao: "INFO" | "SUCCESS" | "WARNING" | "ERROR"
      TipoPlano: "FREE" | "ESSENCIAL"
      TipoReferenciador:
        | "INFLUENCIADOR"
        | "PARCEIRO_COMERCIAL"
        | "AFILIADO"
        | "OUTROS"
      TipoValidacaoInfluencer: "CLIQUE" | "PROVA_UPLOAD"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "member", "super_admin"],
      CategoriaCupom: ["INTERNO", "PUBLICO"],
      CommissionStatus: ["BLOQUEADA", "LIBERADA", "PAGA"],
      DuracaoDesconto: ["UMA_VEZ", "REPETICAO", "PARA_SEMPRE"],
      PaymentStatus: ["NAO_PAGO", "PAGO", "PARCIAL"],
      Role: ["ADMIN", "REFERENCIADOR", "SUPERMASTER"],
      StatusComercial: [
        "NOVO",
        "EM_CONTATO",
        "NEGOCIACAO",
        "FECHADO",
        "COMERCIAL_FINALIZADO",
        "AGUARDANDO_CONVITE",
      ],
      StatusComplianceInfluencer: [
        "EM_ANDAMENTO",
        "OK",
        "FALHA",
        "PENDENTE_VALIDACAO",
      ],
      StatusCupom: ["ATIVO", "PAUSADO", "EXPIRADO"],
      StatusFinanceiro: [
        "AGUARDANDO_PAGAMENTO",
        "PAGO",
        "COMISSAO_LIBERADA",
        "FINANCEIRO_FINALIZADO",
      ],
      StatusLead: ["PENDENTE", "APROVADO", "REJEITADO"],
      StatusRepresentacao: ["PENDENTE", "APROVADO", "REJEITADO"],
      TipoCupom: ["PERCENTUAL", "VALOR_FIXO"],
      TipoLead: ["NORMAL", "INDICACAO_SUGERIDA"],
      TipoNotificacao: ["INFO", "SUCCESS", "WARNING", "ERROR"],
      TipoPlano: ["FREE", "ESSENCIAL"],
      TipoReferenciador: [
        "INFLUENCIADOR",
        "PARCEIRO_COMERCIAL",
        "AFILIADO",
        "OUTROS",
      ],
      TipoValidacaoInfluencer: ["CLIQUE", "PROVA_UPLOAD"],
    },
  },
} as const
