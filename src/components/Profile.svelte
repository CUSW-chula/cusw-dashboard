<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { goto } from '$app/navigation';

  interface ProfileProp {
    id: string;
    name?: string;
    email?: string;
    organization?: string;
    position?: string;
    isOutsourced?: boolean;
    admin?: boolean;
    head?: boolean;
    activated?: boolean;
    fallback?: any;
  }

  export let profile: ProfileProp;

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  const handleLogout = () => {
    document.cookie = 'auth=; Max-Age=0; path=/;';
    window.location.href = "https://cusw-workspace.sa.chula.ac.th/";
  };
</script>


<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <div class="flex items-center space-x-2 border-brown text-brown cursor-pointer">
      <div class="w-[40px] h-[40px] bg-gray-100 rounded-full flex items-center justify-center border-[1px] border-brown hover:bg-gray-200 transition-colors">
        <span class="text-brown text-[16px] font-BaiJamjuree">
            {getInitials(profile.name)}
        </span> 
      </div>
    </div>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label class="text-black text-[18px] font-bold font-BaiJamjuree px-2">
      {profile.name || 'Profile'}
    </DropdownMenu.Label>

    <DropdownMenu.Group>
      {#if profile.admin}
        <DropdownMenu.Item onclick ={() => goto('/admin')}>
          Admin
        </DropdownMenu.Item>
      {/if}
      {#if profile.admin || profile.head}
        <DropdownMenu.Item onclick ={() => goto('/dashboards')}>
          Dashboard
        </DropdownMenu.Item>
      {/if}
    </DropdownMenu.Group>

    <DropdownMenu.Separator />

    <DropdownMenu.Item onclick ={handleLogout} class="text-red-600 font-bold">
      Sign out
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
