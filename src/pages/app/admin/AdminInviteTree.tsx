import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, TreePine, ChevronRight, ChevronDown, Search } from "lucide-react";

interface TreeNode {
  user_id: string;
  full_name: string;
  invited_by: string | null;
  invite_tree_depth: number;
  congregation: string | null;
  created_at: string;
  children: TreeNode[];
}

function buildTree(nodes: Omit<TreeNode, "children">[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  nodes.forEach((n) => map.set(n.user_id, { ...n, children: [] }));

  nodes.forEach((n) => {
    const node = map.get(n.user_id)!;
    if (n.invited_by && map.has(n.invited_by)) {
      map.get(n.invited_by)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function TreeNodeComponent({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children.length > 0;

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
        style={{ marginLeft: `${level * 24}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )
        ) : (
          <span className="w-4 shrink-0" />
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-accent">
              {node.full_name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {node.full_name || "Sem nome"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {node.congregation || "Sem congregação"} · Nível {node.invite_tree_depth ?? level}
            </p>
          </div>
        </div>

        {hasChildren && (
          <Badge variant="secondary" className="shrink-0 text-xs">
            {node.children.length} convidado{node.children.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {expanded &&
        node.children.map((child) => (
          <TreeNodeComponent key={child.user_id} node={child} level={level + 1} />
        ))}
    </div>
  );
}

export default function AdminInviteTree() {
  const [search, setSearch] = useState("");

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["admin-invite-tree"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, invited_by, invite_tree_depth, congregation, created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        user_id: p.id,
        full_name: p.full_name,
        invited_by: p.invited_by,
        invite_tree_depth: p.invite_tree_depth ?? 0,
        congregation: p.congregation,
        created_at: p.created_at,
      }));
    },
  });

  const tree = buildTree(profiles);

  const totalUsers = profiles.length;
  const maxDepth = Math.max(0, ...profiles.map((p) => p.invite_tree_depth));
  const usersWithInvites = new Set(profiles.filter((p) => p.invited_by).map((p) => p.invited_by)).size;

  const filteredTree = search.trim()
    ? profiles
        .filter(
          (p) =>
            p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            p.congregation?.toLowerCase().includes(search.toLowerCase())
        )
        .map((p) => ({ ...p, children: [] as TreeNode[] }))
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Árvore de Convites</h1>
        <p className="text-sm text-muted-foreground">
          Visualize a cadeia de confiança — quem convidou quem
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[140px]">
          <CardContent className="pt-6 text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
            <p className="text-xs text-muted-foreground">Usuários</p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[140px]">
          <CardContent className="pt-6 text-center">
            <TreePine className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-3xl font-bold text-foreground">{maxDepth}</p>
            <p className="text-xs text-muted-foreground">Profundidade máx.</p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[140px]">
          <CardContent className="pt-6 text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-3xl font-bold text-foreground">{usersWithInvites}</p>
            <p className="text-xs text-muted-foreground">Convidadores ativos</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou congregação..."
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cadeia de confiança</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando árvore...</p>
          ) : filteredTree ? (
            filteredTree.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum resultado encontrado.</p>
            ) : (
              filteredTree.map((node) => (
                <TreeNodeComponent key={node.user_id} node={node} level={0} />
              ))
            )
          ) : tree.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
          ) : (
            tree.map((root) => (
              <TreeNodeComponent key={root.user_id} node={root} level={0} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
