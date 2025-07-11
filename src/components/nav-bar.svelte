<script lang="ts">
  import { base } from '$app/paths';
  import { API_BASE_URL } from '../lib/shared.js';
  import Profile from './Profile.svelte';
  import { onMount } from 'svelte';
  import {jwtDecode} from 'jwt-decode';

  let auth = '';
  let profile = {
    id: '',
    name: '',
    email: '',
    organization: '',
    position: '',
    isOutsourced: false,
    admin: false,
    head: false,
    activated: false,
    fallback: 'Loading...'
  };
  let userid = '';

  onMount(() => {
    const cookieString = document.cookie;
    const match = cookieString.match(/auth=([^;]+)/);
    if (match) {
      auth = decodeURIComponent(match[1]);
      try {
        const decoded = jwtDecode<{id: string}>(auth);
        console.log('Decoded JWT:', decoded); // Debug: show decoded token
        if (decoded && decoded.id) {
          userid = decoded.id;
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    console.log('userid before fetchProfile:', userid); // Debug: show userid
    if (userid) fetchProfile();
  });

  async function fetchProfile() {
    console.log('Calling fetchProfile with userid:', userid); // Debug: show fetchProfile call
    try {
      const response = await fetch(`${API_BASE_URL}/v2/users/${userid}`, {
        headers: {
          Authorization: auth
        }
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Fetch error:', errorMessage);
        return;
      }
      const data = await response.json();
      console.log('Fetched profile data:', data); // Debug: show fetched data
      profile = { ...profile, ...data };
    } catch (error) {
      console.error('Error fetching Owner:', error);
    }
  }
  
  function goToTasks() {
    window.location.href = "https://cusw-workspace.sa.chula.ac.th/my-tasks"
  }
</script>

<div class="font-BaiJamjuree flex h-[84px] min-w-full flex-row items-center justify-between px-4">
  <a href="/projects">
    <img src="{base}/logo/s2.svg" alt="CUSW" width={240} />
  </a>
  <div class="flex flex-row gap-4">
    <button
      type="button"
      class="flex justify-center items-center gap-1 h-[40px] bg-brown text-white rounded-[6px] px-3"
      on:click={goToTasks}>
      My task
    </button>
    <Profile {profile} />
  </div>
</div>